import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..');
const PORT = 3006;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1x1 transparent PNG buffer
const TINY_PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

async function runUploadVerification() {
  console.log('🚀 Starting Bunny Cove Server on port', PORT, 'for upload verification...');
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
      // waiting
    }
    await sleep(500);
  }

  if (!ready) {
    child.kill();
    throw new Error('Server did not start in time');
  }

  console.log('✅ Server is up! Running Upload verification test suite...\n');

  try {
    // 1. Register & Login to get token
    console.log('👉 Step 1: Registering test user for upload tests...');
    const testEmail = `upload_tester_${Date.now()}@bunny.test`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        username: `uploader_${Date.now()}`,
        password: 'Password123!',
        displayName: 'Avatar Tester',
      }),
    });
    const regData = await regRes.json();
    if (!regData.success) throw new Error('Registration failed');
    const token = regData.data.accessToken;
    console.log('✅ Test user registered with token');

    // 2. Test Avatar Upload (multipart/form-data)
    console.log('\n👉 Step 2: Testing POST /upload/avatar...');
    const avatarFormData = new FormData();
    const avatarBlob = new Blob([TINY_PNG_BUFFER], { type: 'image/png' });
    avatarFormData.append('file', avatarBlob, 'avatar.png');

    const avatarRes = await fetch(`${BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: avatarFormData,
    });
    const avatarData = await avatarRes.json();
    console.log('Avatar upload response:', JSON.stringify(avatarData, null, 2));

    if (avatarRes.status !== 200 && avatarRes.status !== 201) {
      throw new Error(`Avatar upload failed with status ${avatarRes.status}`);
    }
    if (!avatarData.success || !avatarData.data.avatarUrl) {
      throw new Error('Avatar upload did not return avatarUrl');
    }
    console.log('✅ Avatar upload succeeded! New avatarUrl:', avatarData.data.avatarUrl);

    // 3. Verify User Profile reflects the new avatarUrl
    console.log('\n👉 Step 3: Checking GET /auth/me for updated avatar...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    console.log('Updated user profile:', JSON.stringify(meData.data, null, 2));
    if (meData.data.avatarUrl !== avatarData.data.avatarUrl) {
      throw new Error('User profile did not persist the new avatarUrl');
    }
    console.log('✅ Profile avatar correctly updated in PostgreSQL!');

    // 4. Test Chat Image Upload
    console.log('\n👉 Step 4: Testing POST /upload/chat-image...');
    const chatFormData = new FormData();
    const chatBlob = new Blob([TINY_PNG_BUFFER], { type: 'image/png' });
    chatFormData.append('file', chatBlob, 'bunny_reaction.png');
    chatFormData.append('roomId', 'BUNNY-99');

    const chatRes = await fetch(`${BASE_URL}/upload/chat-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: chatFormData,
    });
    const chatData = await chatRes.json();
    console.log('Chat image upload response:', JSON.stringify(chatData, null, 2));

    if (chatRes.status !== 200 && chatRes.status !== 201) {
      throw new Error(`Chat image upload failed with status ${chatRes.status}`);
    }
    if (!chatData.success || !chatData.data.imageUrl) {
      throw new Error('Chat image upload did not return imageUrl');
    }
    console.log('✅ Chat image upload succeeded! Ready for in-room chat broadcasting.');

    // 5. Test Invalid File Format Validation
    console.log('\n👉 Step 5: Testing validation on invalid file type...');
    const invalidFormData = new FormData();
    const textBlob = new Blob(['hello world text'], { type: 'text/plain' });
    invalidFormData.append('file', textBlob, 'notes.txt');

    const invalidRes = await fetch(`${BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: invalidFormData,
    });
    const invalidData = await invalidRes.json();
    console.log('Invalid upload response (Expected 400):', JSON.stringify(invalidData, null, 2));

    if (invalidRes.status !== 400 || invalidData.success !== false) {
      throw new Error('Expected 400 Bad Request for invalid file type');
    }
    console.log('✅ Validation correctly rejected non-image upload with 400!');

    console.log('\n🎉 ALL CLOUDINARY UPLOAD FLOW TESTS PASSED SUCCESSFULLY! 🎉\n');
  } finally {
    console.log('Stopping test server...');
    child.kill('SIGINT');
  }
}

runUploadVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
