import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..');
const PORT = 3009;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
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

async function runProfileVerificationSuite() {
  console.log('🚀 Starting Bunny Cove Server on port', PORT, 'for User Profile verification...');

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
    throw new Error('Server did not start within 15 seconds');
  }

  console.log('✅ Server is ready! Commencing User Profile & Stats Tests...\n');

  try {
    const timestamp = Date.now();
    const testEmail = `profile_tester_${timestamp}@bunny.test`;
    const initialName = 'Thỏ Nghiệp Dư';
    const targetUsername = `bunny_hero_${timestamp.toString(36)}`;

    // ==========================================
    // Setup: Register Player 1
    // ==========================================
    console.log(`👉 Setup: Registering test user (${testEmail})...`);
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'Password123!',
        displayName: initialName,
      },
    });

    if (regRes.status !== 201 || !regRes.data.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
    }

    const accessToken = regRes.data.data.accessToken;
    const initialUserId = regRes.data.data.user.id;
    const initialUsername = regRes.data.data.user.username;
    console.log(`✅ Registered user ${initialUserId} with username: ${initialUsername}`);

    // ==========================================
    // Step 1: Test GET /users/me (Detailed Profile)
    // ==========================================
    console.log('\n👉 Step 1: Testing GET /users/me (Authenticated profile)...');
    const profileRes = await request('/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log('Profile response status:', profileRes.status);
    console.log('Profile summary:', JSON.stringify(profileRes.data.data?.summary, null, 2));

    if (profileRes.status !== 200 || !profileRes.data.success) {
      throw new Error(`Profile fetch failed: ${JSON.stringify(profileRes.data)}`);
    }

    if (profileRes.data.code !== 'profile_fetched') {
      throw new Error(`Expected code 'profile_fetched', got: ${profileRes.data.code}`);
    }

    const userData = profileRes.data.data.user;
    if (userData.id !== initialUserId || userData.displayName !== initialName) {
      throw new Error(`User data mismatch: expected displayName '${initialName}', got '${userData.displayName}'`);
    }

    const summary = profileRes.data.data.summary;
    if (summary.totalMatches === undefined || summary.winRate === undefined || summary.totalPoints === undefined) {
      throw new Error(`Summary statistics missing fields: ${JSON.stringify(summary)}`);
    }

    if (!Array.isArray(profileRes.data.data.stats) || !Array.isArray(profileRes.data.data.recentMatches)) {
      throw new Error('Expected stats and recentMatches to be arrays');
    }
    console.log('✅ GET /users/me succeeded with personal info, summary stats, and match history arrays');

    // ==========================================
    // Step 2: Test GET /users/me without Auth (Expect 401)
    // ==========================================
    console.log('\n👉 Step 2: Testing GET /users/me without auth token (Expect 401)...');
    const unauthRes = await request('/users/me');
    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got: ${unauthRes.status}`);
    }
    console.log('✅ Unauthenticated access correctly rejected with 401');

    // ==========================================
    // Step 3: Test PATCH /users/me (Update Display Name)
    // ==========================================
    console.log('\n👉 Step 3: Testing PATCH /users/me to update displayName...');
    const updatedName = 'Thỏ Chiến Thần 🐰';
    const updateNameRes = await request('/users/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { displayName: updatedName },
    });

    if (updateNameRes.status !== 200 || !updateNameRes.data.success) {
      throw new Error(`Update displayName failed: ${JSON.stringify(updateNameRes.data)}`);
    }

    if (updateNameRes.data.code !== 'profile_updated') {
      throw new Error(`Expected code 'profile_updated', got: ${updateNameRes.data.code}`);
    }

    if (updateNameRes.data.data.displayName !== updatedName) {
      throw new Error(`Expected updated displayName '${updatedName}', got: ${updateNameRes.data.data.displayName}`);
    }
    console.log('✅ Display name updated successfully to:', updatedName);

    // ==========================================
    // Step 4: Test PATCH /users/me (Update Custom Username)
    // ==========================================
    console.log(`\n👉 Step 4: Testing PATCH /users/me to set custom username: ${targetUsername}...`);
    const updateUsernameRes = await request('/users/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { username: targetUsername },
    });

    if (updateUsernameRes.status !== 200 || !updateUsernameRes.data.success) {
      throw new Error(`Update username failed: ${JSON.stringify(updateUsernameRes.data)}`);
    }

    if (updateUsernameRes.data.data.username !== targetUsername) {
      throw new Error(`Expected username '${targetUsername}', got: ${updateUsernameRes.data.data.username}`);
    }
    console.log('✅ Username updated successfully to:', targetUsername);

    // ==========================================
    // Step 5: Test PATCH /users/me Username Conflict (Expect 409)
    // ==========================================
    console.log('\n👉 Step 5: Testing duplicate username conflict rejection (Expect 409)...');
    const player2Email = `player2_${timestamp}@bunny.test`;
    const reg2Res = await request('/auth/register', {
      method: 'POST',
      body: {
        email: player2Email,
        password: 'Password123!',
        displayName: 'Imposter Player',
      },
    });

    const player2Token = reg2Res.data.data.accessToken;

    const conflictRes = await request('/users/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${player2Token}` },
      body: { username: targetUsername }, // Attempt to take targetUsername
    });

    if (conflictRes.status !== 409) {
      throw new Error(`Expected 409 Conflict for duplicate username, got: ${conflictRes.status}`);
    }

    if (conflictRes.data.error?.code !== 'username_already_exists') {
      throw new Error(`Expected code 'username_already_exists', got: ${conflictRes.data.error?.code}`);
    }
    console.log('✅ Duplicate username correctly rejected with 409 and code: username_already_exists');

    // ==========================================
    // Step 6: Test GET /users/me/stats (Detailed Game Stats)
    // ==========================================
    console.log('\n👉 Step 6: Testing GET /users/me/stats...');
    const statsRes = await request('/users/me/stats', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (statsRes.status !== 200 || !statsRes.data.success) {
      throw new Error(`Stats fetch failed: ${JSON.stringify(statsRes.data)}`);
    }

    if (statsRes.data.code !== 'stats_fetched') {
      throw new Error(`Expected code 'stats_fetched', got: ${statsRes.data.code}`);
    }
    console.log('✅ GET /users/me/stats succeeded! Response:', statsRes.data.code);

    // ==========================================
    // Step 7: Test GET /users/me/matches (Paginated History)
    // ==========================================
    console.log('\n👉 Step 7: Testing GET /users/me/matches with limit=5&offset=0...');
    const matchesRes = await request('/users/me/matches?limit=5&offset=0', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (matchesRes.status !== 200 || !matchesRes.data.success) {
      throw new Error(`Matches fetch failed: ${JSON.stringify(matchesRes.data)}`);
    }

    if (matchesRes.data.code !== 'match_history_fetched') {
      throw new Error(`Expected code 'match_history_fetched', got: ${matchesRes.data.code}`);
    }

    if (matchesRes.data.data.limit !== 5 || matchesRes.data.data.offset !== 0) {
      throw new Error('Pagination limit/offset parameters not reflected in response');
    }
    console.log('✅ GET /users/me/matches pagination verified successfully');

    // ==========================================
    // Step 8: Test GET /users/:identifier (Public Profile)
    // ==========================================
    console.log(`\n👉 Step 8: Testing GET /users/${targetUsername} (Public profile view)...`);
    const publicRes = await request(`/users/${targetUsername}`);

    if (publicRes.status !== 200 || !publicRes.data.success) {
      throw new Error(`Public profile fetch failed: ${JSON.stringify(publicRes.data)}`);
    }

    const pubData = publicRes.data.data;
    if (pubData.username !== targetUsername || pubData.displayName !== updatedName) {
      throw new Error(`Public profile data mismatch: ${JSON.stringify(pubData)}`);
    }

    // Security check: ensure private email is NOT exposed in public endpoint
    if (pubData.email !== undefined) {
      throw new Error('SECURITY VIOLATION: User email leaked in public profile endpoint!');
    }
    console.log('✅ Public profile view succeeded without exposing private email!');

    // ==========================================
    // Step 9: Test GET /users/:identifier for Non-existent User (404)
    // ==========================================
    console.log('\n👉 Step 9: Testing GET /users/ghost_bunny_not_found (Expect 404)...');
    const notFoundRes = await request('/users/ghost_bunny_not_found');

    if (notFoundRes.status !== 404) {
      throw new Error(`Expected 404 Not Found, got: ${notFoundRes.status}`);
    }

    if (notFoundRes.data.error?.code !== 'user_not_found') {
      throw new Error(`Expected code 'user_not_found', got: ${notFoundRes.data.error?.code}`);
    }
    console.log('✅ Non-existent user correctly returned 404 with code: user_not_found');

    console.log('\n🎉 ALL 9 USER PROFILE & STATS TEST STEPS PASSED 100%! 🎉\n');
  } finally {
    console.log('🧹 Terminating test server process...');
    child.kill();
    await sleep(500);
  }
}

runProfileVerificationSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Profile Verification Failed:', err.message);
    process.exit(1);
  });
