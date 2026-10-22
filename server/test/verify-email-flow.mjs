import http from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..');
const PORT = 3008;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const status = response.status;
  const setCookie = response.headers.get('set-cookie');
  let data = null;
  const text = await response.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status, data, setCookie };
}

async function runEmailVerificationSuite() {
  console.log('🚀 Starting Bunny Cove Server on port', PORT, 'for Email & Password Reset verification...');

  const capturedOtps = {
    verify: {},
    reset: {},
  };

  const child = spawn('node', ['dist/main.js'], {
    cwd: serverDir,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let currentToEmail = null;

  child.stdout.on('data', (d) => {
    const text = d.toString();
    process.stdout.write(`[SERVER] ${text}`);

    // Parse recipient email if printed
    const toMatch = text.match(/To:\s*([^\s@]+@[^\s@)]+)/);
    if (toMatch) {
      currentToEmail = toMatch[1].trim().toLowerCase();
    }

    // Match verification OTP: "[ 123456 ]"
    const verifyOtpMatch = text.match(/(?:xác thực|OTP for).*?\[\s*(\d{6})\s*\]/i);
    if (verifyOtpMatch) {
      const email = currentToEmail || 'latest';
      capturedOtps.verify[email] = verifyOtpMatch[1];
      capturedOtps.verify['latest'] = verifyOtpMatch[1];
    }

    // Match reset OTP: "[ 123456 ]"
    const resetOtpMatch = text.match(/(?:đặt lại mật khẩu|Reset OTP for).*?\[\s*(\d{6})\s*\]/i);
    if (resetOtpMatch) {
      const email = currentToEmail || 'latest';
      capturedOtps.reset[email] = resetOtpMatch[1];
      capturedOtps.reset['latest'] = resetOtpMatch[1];
    }
  });

  child.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d.toString()}`));

  // Wait for server to start
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/docs`);
      if (res.status === 200 || res.status === 301) {
        ready = true;
        break;
      }
    } catch {
      // not yet ready
    }
    await sleep(500);
  }

  if (!ready) {
    child.kill();
    throw new Error('Server did not start within 15 seconds');
  }

  console.log('✅ Server is ready! Commencing Email Verification & Password Reset Tests...\n');

  try {
    const timestamp = Date.now();
    const testEmail = `player_${timestamp}@gmail.com`;
    const initialPassword = 'BunnyPassword123!';
    const newPassword = 'NewSecretBunny456!';

    // ==========================================
    // Step 1: Register User and Expect 2-min OTP
    // ==========================================
    console.log(`👉 Step 1: Registering user with personal email: ${testEmail}...`);
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        email: testEmail,
        password: initialPassword,
        displayName: 'Thỏ Hồng Đáng Yêu',
      },
    });

    if (regRes.status !== 201 || !regRes.data.success) {
      throw new Error(`Registration failed with status ${regRes.status}: ${JSON.stringify(regRes.data)}`);
    }

    if (regRes.data.data.user.isEmailVerified !== false) {
      throw new Error(`Expected isEmailVerified to be false upon registration, got: ${regRes.data.data.user.isEmailVerified}`);
    }
    console.log('✅ Registration succeeded. User created with isEmailVerified = false');

    // Wait up to 3s for verification OTP to be captured
    for (let i = 0; i < 15; i++) {
      if (capturedOtps.verify[testEmail] || capturedOtps.verify['latest']) break;
      await sleep(200);
    }

    const verificationOtp = capturedOtps.verify[testEmail] || capturedOtps.verify['latest'];
    if (!verificationOtp || verificationOtp.length !== 6) {
      throw new Error(`Failed to capture 6-digit verification OTP from server console!`);
    }
    console.log(`✅ Captured 6-digit verification OTP (valid for 2 mins): ${verificationOtp}`);

    // ==========================================
    // Step 2: Check Profile /auth/me
    // ==========================================
    console.log('\n👉 Step 2: Checking profile /auth/me for isEmailVerified status...');
    const accessToken = regRes.data.data.accessToken;
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (meRes.status !== 200 || meRes.data.data.isEmailVerified !== false) {
      throw new Error(`Profile check failed or isEmailVerified is not false: ${JSON.stringify(meRes.data)}`);
    }
    console.log('✅ Profile confirmed isEmailVerified = false');

    // ==========================================
    // Step 3: Test Verify Email with Invalid OTP
    // ==========================================
    console.log('\n👉 Step 3: Testing POST /auth/verify-email with INVALID OTP (000000)...');
    const invalidVerifyRes = await request('/auth/verify-email', {
      method: 'POST',
      body: {
        email: testEmail,
        otp: '000000',
      },
    });

    if (invalidVerifyRes.status !== 400) {
      throw new Error(`Expected 400 Bad Request for invalid OTP, got: ${invalidVerifyRes.status}`);
    }
    console.log('✅ Invalid OTP correctly rejected by server with 400 Bad Request');

    // ==========================================
    // Step 4: Test Verify Email with Correct OTP
    // ==========================================
    console.log(`\n👉 Step 4: Testing POST /auth/verify-email with VALID OTP (${verificationOtp})...`);
    const validVerifyRes = await request('/auth/verify-email', {
      method: 'POST',
      body: {
        email: testEmail,
        otp: verificationOtp,
      },
    });

    if (validVerifyRes.status !== 200 || !validVerifyRes.data.success) {
      throw new Error(`Email verification failed with status ${validVerifyRes.status}: ${JSON.stringify(validVerifyRes.data)}`);
    }
    console.log('✅ Email successfully verified! Response:', validVerifyRes.data.code);

    // ==========================================
    // Step 5: Test Verify Again (Already Verified)
    // ==========================================
    console.log('\n👉 Step 5: Testing POST /auth/verify-email again (already verified)...');
    const duplicateVerifyRes = await request('/auth/verify-email', {
      method: 'POST',
      body: {
        email: testEmail,
        otp: verificationOtp,
      },
    });

    if (duplicateVerifyRes.status !== 400) {
      throw new Error(`Expected 400 for already verified email, got: ${duplicateVerifyRes.status}`);
    }
    console.log('✅ Duplicate verification correctly blocked with 400');

    // ==========================================
    // Step 6: Test Resend Verification when Already Verified
    // ==========================================
    console.log('\n👉 Step 6: Testing POST /auth/resend-verification on verified account...');
    const resendOnVerifiedRes = await request('/auth/resend-verification', {
      method: 'POST',
      body: { email: testEmail },
    });

    if (resendOnVerifiedRes.status !== 400) {
      throw new Error(`Expected 400 for resend on already verified email, got: ${resendOnVerifiedRes.status}`);
    }
    console.log('✅ Resend on already verified email correctly rejected with 400');

    // ==========================================
    // Step 7: Test Forgot Password (Send Reset OTP)
    // ==========================================
    console.log('\n👉 Step 7: Testing POST /auth/forgot-password...');
    const forgotRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: { email: testEmail },
    });

    if (forgotRes.status !== 200 || !forgotRes.data.success) {
      throw new Error(`Forgot password failed with status ${forgotRes.status}: ${JSON.stringify(forgotRes.data)}`);
    }
    console.log('✅ Password reset OTP requested successfully!');

    // Wait up to 3s for reset OTP to be captured
    for (let i = 0; i < 15; i++) {
      if (capturedOtps.reset[testEmail] || capturedOtps.reset['latest']) break;
      await sleep(200);
    }

    const resetOtp = capturedOtps.reset[testEmail] || capturedOtps.reset['latest'];
    if (!resetOtp || resetOtp.length !== 6) {
      throw new Error(`Failed to capture 6-digit password reset OTP from server console!`);
    }
    console.log(`✅ Captured 6-digit reset OTP (valid for 2 mins): ${resetOtp}`);

    // ==========================================
    // Step 8: Test Forgot Password Cooldown (60s)
    // ==========================================
    console.log('\n👉 Step 8: Testing POST /auth/forgot-password immediate second request (cooldown)...');
    const cooldownRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: { email: testEmail },
    });

    if (cooldownRes.status !== 400) {
      throw new Error(`Expected 400 Cooldown Active, got: ${cooldownRes.status}`);
    }
    console.log('✅ Resend cooldown correctly triggered and blocked with 400');

    // ==========================================
    // Step 9: Test Reset Password with Invalid OTP
    // ==========================================
    console.log('\n👉 Step 9: Testing POST /auth/reset-password with INVALID OTP (999999)...');
    const invalidResetRes = await request('/auth/reset-password', {
      method: 'POST',
      body: {
        email: testEmail,
        otp: '999999',
        newPassword: newPassword,
      },
    });

    if (invalidResetRes.status !== 400) {
      throw new Error(`Expected 400 for invalid reset OTP, got: ${invalidResetRes.status}`);
    }
    console.log('✅ Invalid reset OTP correctly rejected with 400');

    // ==========================================
    // Step 10: Test Reset Password with Valid OTP
    // ==========================================
    console.log(`\n👉 Step 10: Testing POST /auth/reset-password with VALID OTP (${resetOtp})...`);
    const validResetRes = await request('/auth/reset-password', {
      method: 'POST',
      body: {
        email: testEmail,
        otp: resetOtp,
        newPassword: newPassword,
      },
    });

    if (validResetRes.status !== 200 || !validResetRes.data.success) {
      throw new Error(`Reset password failed with status ${validResetRes.status}: ${JSON.stringify(validResetRes.data)}`);
    }
    console.log('✅ Password reset succeeded! Response:', validResetRes.data.code);

    // ==========================================
    // Step 11: Test Login with Old Password (Should Fail)
    // ==========================================
    console.log('\n👉 Step 11: Verifying old password is now invalid...');
    const oldLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        identifier: testEmail,
        password: initialPassword,
      },
    });

    if (oldLoginRes.status !== 401) {
      throw new Error(`Expected 401 for old password, got: ${oldLoginRes.status}`);
    }
    console.log('✅ Old password login rejected with 401 Unauthorized');

    // ==========================================
    // Step 12: Test Login with New Password (Should Succeed)
    // ==========================================
    console.log('\n👉 Step 12: Testing login with NEW password...');
    const newLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        identifier: testEmail,
        password: newPassword,
      },
    });

    if (newLoginRes.status !== 200 || !newLoginRes.data.success) {
      throw new Error(`Login with new password failed with status ${newLoginRes.status}`);
    }

    if (newLoginRes.data.data.user.isEmailVerified !== true) {
      throw new Error(`Expected isEmailVerified to be true upon login, got: ${newLoginRes.data.data.user.isEmailVerified}`);
    }
    console.log('✅ Login with new password succeeded! User confirmed verified: isEmailVerified = true');

    console.log('\n🎉 ALL 12 EMAIL VERIFICATION & PASSWORD RESET TEST STEPS PASSED 100%! 🎉\n');
  } finally {
    console.log('🧹 Terminating test server process...');
    child.kill();
    await sleep(500);
  }
}

runEmailVerificationSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Verification Failed:', err.message);
    process.exit(1);
  });
