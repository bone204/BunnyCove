import http from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..');
const PORT = 3005;
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

async function runVerification() {
  console.log('🚀 Starting Bunny Cove Server on port', PORT, 'for verification...');
  const child = spawn('node', ['dist/main.js'], {
    cwd: serverDir,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d.toString()}`));
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
    throw new Error('Server did not start in time');
  }

  console.log('✅ Server is up and ready! Running test suite...\n');

  try {
    // 1. Check Swagger UI endpoint
    console.log('👉 Step 1: Testing Swagger UI endpoint (/api/docs)...');
    const swaggerRes = await fetch(`${BASE_URL}/api/docs`);
    if (swaggerRes.status !== 200) {
      throw new Error(`Swagger endpoint returned status ${swaggerRes.status}`);
    }
    const swaggerHtml = await swaggerRes.text();
    if (!swaggerHtml.includes('SwaggerUIBundle') && !swaggerHtml.includes('Bunny Cove API')) {
      throw new Error('Swagger UI page does not contain expected title or scripts');
    }
    console.log('✅ Swagger UI is active and accessible at /api/docs');

    // 2. Test User Registration
    console.log('\n👉 Step 2: Testing POST /auth/register...');
    const testEmail = `bunny_${Date.now()}@bunny.test`;
    const registerRes = await request('/auth/register', {
      method: 'POST',
      body: {
        email: testEmail,
        username: `bunny_${Date.now()}`,
        password: 'Password123!',
        displayName: 'Bunny Tester',
      },
    });

    console.log('Register response status:', registerRes.status);
    console.log('Register body:', JSON.stringify(registerRes.data, null, 2));
    if (registerRes.status !== 201 || !registerRes.data.success) {
      throw new Error(`Registration failed with status ${registerRes.status}`);
    }
    if (!registerRes.data.data.accessToken || !registerRes.data.data.refreshToken) {
      throw new Error('Registration did not return access & refresh tokens');
    }
    if (!registerRes.setCookie || !registerRes.setCookie.includes('refresh_token=')) {
      throw new Error('Registration did not set refresh_token cookie');
    }
    console.log('✅ Registration passed (Tokens & HTTP-only cookie issued)');

    // 3. Test User Login
    console.log('\n👉 Step 3: Testing POST /auth/login...');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        identifier: testEmail,
        password: 'Password123!',
      },
    });

    console.log('Login response status:', loginRes.status);
    if (loginRes.status !== 200 || !loginRes.data.success) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }
    const accessToken = loginRes.data.data.accessToken;
    const refreshToken = loginRes.data.data.refreshToken;
    const cookieHeader = loginRes.setCookie ? loginRes.setCookie.split(';')[0] : '';
    console.log('✅ Login passed (JWT Access Token & Refresh Cookie received)');

    // 4. Test Protected Profile Route
    console.log('\n👉 Step 4: Testing GET /auth/me (Protected route)...');
    const unauthorizedRes = await request('/auth/me');
    if (unauthorizedRes.status !== 401) {
      throw new Error(`Expected 401 for unauthenticated request, got ${unauthorizedRes.status}`);
    }
    console.log('✅ Unauthorized access rejected with 401 as expected');

    const meRes = await request('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Authenticated profile response:', JSON.stringify(meRes.data, null, 2));
    if (meRes.status !== 200 || !meRes.data.success || meRes.data.data.email !== testEmail) {
      throw new Error('Profile request failed or user email does not match');
    }
    console.log('✅ Authenticated request to /auth/me succeeded');

    // 5. Test Token Refresh
    console.log('\n👉 Step 5: Testing POST /auth/refresh...');
    await sleep(1000); // Wait 1s so JWT second-precision timestamp (iat) advances
    const refreshRes = await request('/auth/refresh', {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
      },
      body: {
        refreshToken: refreshToken,
      },
    });
    console.log('Refresh response:', JSON.stringify(refreshRes.data, null, 2));
    if (refreshRes.status !== 200 || !refreshRes.data.success) {
      throw new Error(`Token refresh failed with status ${refreshRes.status}`);
    }
    const newAccessToken = refreshRes.data.data.accessToken;
    if (!newAccessToken || newAccessToken === accessToken) {
      throw new Error('Token refresh did not produce a new access token');
    }
    console.log('✅ Token refresh succeeded with token rotation');

    // 6. Test Logout
    console.log('\n👉 Step 6: Testing POST /auth/logout...');
    const logoutRes = await request('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
    console.log('Logout response:', JSON.stringify(logoutRes.data, null, 2));
    if (logoutRes.status !== 200 || !logoutRes.data.success) {
      throw new Error(`Logout failed with status ${logoutRes.status}`);
    }
    console.log('✅ Logout succeeded and session invalidated');

    console.log('\n🎉 ALL AUTH & SWAGGER TESTS PASSED SUCCESSFULLY! 🎉\n');
  } finally {
    console.log('Stopping test server...');
    child.kill('SIGINT');
  }
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
