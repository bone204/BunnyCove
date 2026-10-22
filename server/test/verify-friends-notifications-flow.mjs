import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { io } from 'socket.io-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..');
const PORT = 3014;
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

function extractCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function runFriendsNotificationsSuite() {
  console.log(`🚀 Starting Bunny Cove Server on port ${PORT} for Friends & Notifications verification...`);

  const child = spawn('node', ['dist/main.js'], {
    cwd: serverDir,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d.toString()}`));
  child.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d.toString()}`));

  // Wait for server to boot
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/docs`);
      if (res.status === 200 || res.status === 301) {
        ready = true;
        break;
      }
    } catch {
      // Waiting
    }
    await sleep(500);
  }

  if (!ready) {
    child.kill();
    throw new Error('Server did not start within 15 seconds');
  }

  console.log('✅ Server is ready! Starting test scenarios...\n');

  let aliceSocket = null;
  let bobSocket = null;

  try {
    const timestamp = Date.now();
    const aliceEmail = `alice_${timestamp}@bunny.test`;
    const bobEmail = `bob_${timestamp}@bunny.test`;
    const bobCustomUsername = `bunny_bob_${timestamp.toString(36)}`;

    // ========================================================
    // 1. Register Alice & Bob
    // ========================================================
    console.log('🐰 [Step 1] Registering Alice and Bob...');
    const aliceReg = await request('/auth/register', {
      method: 'POST',
      body: {
        email: aliceEmail,
        password: 'Password123!',
        displayName: 'Alice Bunny',
      },
    });
    if (aliceReg.status !== 201) {
      throw new Error(`Failed to register Alice: ${JSON.stringify(aliceReg.data)}`);
    }
    const aliceAccessToken = aliceReg.data.data.accessToken;
    const aliceId = aliceReg.data.data.user.id;
    const aliceHeaders = { Authorization: `Bearer ${aliceAccessToken}` };
    console.log(`✅ Alice registered: ID=${aliceId}`);

    const bobReg = await request('/auth/register', {
      method: 'POST',
      body: {
        email: bobEmail,
        password: 'Password123!',
        displayName: 'Bob Rabbit',
      },
    });
    if (bobReg.status !== 201) {
      throw new Error(`Failed to register Bob: ${JSON.stringify(bobReg.data)}`);
    }
    const bobAccessToken = bobReg.data.data.accessToken;
    const bobId = bobReg.data.data.user.id;
    const bobHeaders = { Authorization: `Bearer ${bobAccessToken}` };

    // Set Bob's custom username to test identifier lookup
    await request('/users/me', {
      method: 'PATCH',
      headers: bobHeaders,
      body: { username: bobCustomUsername },
    });

    console.log(`✅ Bob registered: ID=${bobId}, Username=@${bobCustomUsername}`);

    // ========================================================
    // 2. Connect Bob to Socket.IO and Subscribe to Notifications
    // ========================================================
    console.log('\n🐰 [Step 2] Connecting Bob to Notifications WebSocket...');
    bobSocket = io(BASE_URL, { transports: ['websocket'] });
    await new Promise((res) => bobSocket.on('connect', res));
    console.log('✅ Bob socket connected:', bobSocket.id);

    const bobSubAck = await new Promise((res) => {
      bobSocket.emit('notification:subscribe', { userId: bobId }, res);
    });
    console.log('✅ Bob subscribed to notifications:', JSON.stringify(bobSubAck));
    if (!bobSubAck?.success) {
      throw new Error('Bob failed to subscribe to notifications');
    }

    // ========================================================
    // 2b. Register FCM Device Token for Bob
    // ========================================================
    console.log('\n🐰 [Step 2b] Registering FCM Device Push Token for Bob...');
    const fcmTokenRes = await request('/notifications/fcm-token', {
      method: 'POST',
      headers: bobHeaders,
      body: { fcmToken: 'fcm_sample_token_bob_device_ios_retina_123' },
    });
    console.log('✅ FCM token registered response:', JSON.stringify(fcmTokenRes.data));
    if (fcmTokenRes.status !== 200 || fcmTokenRes.data?.code !== 'fcm_token_updated') {
      throw new Error(`Failed to register FCM token: ${JSON.stringify(fcmTokenRes.data)}`);
    }

    // Set up promise to intercept real-time notification on Bob's socket
    let bobReceivedNotificationPromise = new Promise((resolve) => {
      bobSocket.once('notification:new', (payload) => {
        resolve(payload);
      });
    });

    // ========================================================
    // 3. Negative Validation: Self-friending
    // ========================================================
    console.log('\n🐰 [Step 3] Testing negative case: Self-friending prevention...');
    const selfFriendRes = await request('/friends/request', {
      method: 'POST',
      headers: aliceHeaders,
      body: { target: aliceId },
    });
    const selfFriendCode = selfFriendRes.data?.error?.code || selfFriendRes.data?.code;
    console.log(`✅ Self-friend status=${selfFriendRes.status}, code=${selfFriendCode}`);
    if (selfFriendRes.status !== 400 || selfFriendCode !== 'cannot_friend_self') {
      throw new Error(`Expected cannot_friend_self (400), got: ${JSON.stringify(selfFriendRes.data)}`);
    }

    // ========================================================
    // 4. Negative Validation: Non-existent Target
    // ========================================================
    console.log('\n🐰 [Step 4] Testing negative case: Non-existent user target...');
    const nonExistentRes = await request('/friends/request', {
      method: 'POST',
      headers: aliceHeaders,
      body: { target: 'non_existent_ghost_rabbit_99999' },
    });
    const nonExistentCode = nonExistentRes.data?.error?.code || nonExistentRes.data?.code;
    console.log(`✅ Non-existent user status=${nonExistentRes.status}, code=${nonExistentCode}`);
    if (nonExistentRes.status !== 404 || nonExistentCode !== 'user_not_found') {
      throw new Error(`Expected user_not_found (404), got: ${JSON.stringify(nonExistentRes.data)}`);
    }

    // ========================================================
    // 5. Send Friend Request (Alice -> Bob by @username)
    // ========================================================
    console.log('\n🐰 [Step 5] Alice sends friend request to Bob by @username...');
    const sendRes = await request('/friends/request', {
      method: 'POST',
      headers: aliceHeaders,
      body: { target: bobCustomUsername },
    });
    console.log('✅ Friend request sent response:', JSON.stringify(sendRes.data));
    if (sendRes.status !== 200 || sendRes.data?.code !== 'friend_request_sent') {
      throw new Error(`Failed to send friend request: ${JSON.stringify(sendRes.data)}`);
    }
    const friendshipId = sendRes.data.data.id;

    // Check Bob received real-time WebSocket notification!
    console.log('🐰 Waiting for Bob to receive real-time notification:new event...');
    const bobRealtimeNoti = await Promise.race([
      bobReceivedNotificationPromise,
      sleep(4000).then(() => null),
    ]);
    if (!bobRealtimeNoti) {
      throw new Error('Bob did not receive real-time notification:new event within 4 seconds');
    }
    console.log('🎉 Bob received real-time notification:', JSON.stringify(bobRealtimeNoti));
    if (bobRealtimeNoti.data?.type !== 'FRIEND_REQUEST') {
      throw new Error(`Expected notification type FRIEND_REQUEST, got: ${bobRealtimeNoti.data?.type}`);
    }

    // ========================================================
    // 6. Duplicate Friend Request Prevention
    // ========================================================
    console.log('\n🐰 [Step 6] Testing duplicate friend request prevention...');
    const duplicateRes = await request('/friends/request', {
      method: 'POST',
      headers: aliceHeaders,
      body: { target: bobId },
    });
    const duplicateCode = duplicateRes.data?.error?.code || duplicateRes.data?.code;
    console.log(`✅ Duplicate request status=${duplicateRes.status}, code=${duplicateCode}`);
    if (duplicateRes.status !== 409 || duplicateCode !== 'friend_request_already_sent') {
      throw new Error(`Expected friend_request_already_sent (409), got: ${JSON.stringify(duplicateRes.data)}`);
    }

    // ========================================================
    // 7. Verify Pending Requests Endpoint
    // ========================================================
    console.log('\n🐰 [Step 7] Checking pending requests for both Alice and Bob...');
    const alicePending = await request('/friends/requests', { headers: aliceHeaders });
    const bobPending = await request('/friends/requests', { headers: bobHeaders });

    if (alicePending.data?.data?.sent?.length !== 1) {
      throw new Error(`Alice sent requests count expected 1, got: ${alicePending.data?.data?.sent?.length}`);
    }
    if (bobPending.data?.data?.received?.length !== 1) {
      throw new Error(`Bob received requests count expected 1, got: ${bobPending.data?.data?.received?.length}`);
    }
    console.log('✅ Pending requests verified successfully on both sides!');

    // ========================================================
    // 8. Verify Bob Notifications List & Unread Count
    // ========================================================
    console.log('\n🐰 [Step 8] Checking Bob notification list & unread count...');
    const bobNotis = await request('/notifications', { headers: bobHeaders });
    const bobUnread = await request('/notifications/unread-count', { headers: bobHeaders });
    console.log(`✅ Bob notifications count=${bobNotis.data?.data?.notifications?.length}, unread=${bobUnread.data?.data?.unreadCount}`);
    if (bobUnread.data?.data?.unreadCount < 1) {
      throw new Error('Bob unread count should be at least 1');
    }
    const notiId = bobNotis.data?.data?.notifications?.[0]?.id;

    // ========================================================
    // 9. Connect Alice to Socket.IO to receive FRIEND_ACCEPTED event
    // ========================================================
    console.log('\n🐰 [Step 9] Connecting Alice to Notifications WebSocket...');
    aliceSocket = io(BASE_URL, { transports: ['websocket'] });
    await new Promise((res) => aliceSocket.on('connect', res));
    await new Promise((res) => {
      aliceSocket.emit('notification:subscribe', { userId: aliceId }, res);
    });
    console.log('✅ Alice socket connected & subscribed');

    const aliceAcceptedNotiPromise = new Promise((resolve) => {
      aliceSocket.once('notification:new', (payload) => {
        resolve(payload);
      });
    });

    // ========================================================
    // 10. Bob Accepts Friend Request
    // ========================================================
    console.log('\n🐰 [Step 10] Bob accepts friend request...');
    const acceptRes = await request(`/friends/accept/${friendshipId}`, {
      method: 'POST',
      headers: bobHeaders,
    });
    console.log('✅ Accept response:', JSON.stringify(acceptRes.data));
    if (acceptRes.status !== 200 || acceptRes.data?.code !== 'friend_request_accepted') {
      throw new Error(`Failed to accept friend request: ${JSON.stringify(acceptRes.data)}`);
    }

    // Check Alice received FRIEND_ACCEPTED real-time notification
    console.log('🐰 Waiting for Alice to receive FRIEND_ACCEPTED notification:new event...');
    const aliceRealtimeNoti = await Promise.race([
      aliceAcceptedNotiPromise,
      sleep(4000).then(() => null),
    ]);
    if (!aliceRealtimeNoti) {
      throw new Error('Alice did not receive real-time notification:new event within 4 seconds');
    }
    console.log('🎉 Alice received real-time notification:', JSON.stringify(aliceRealtimeNoti));
    if (aliceRealtimeNoti.data?.type !== 'FRIEND_ACCEPTED') {
      throw new Error(`Expected FRIEND_ACCEPTED, got: ${aliceRealtimeNoti.data?.type}`);
    }

    // ========================================================
    // 11. Verify Active Friendship and Online Presence
    // ========================================================
    console.log('\n🐰 [Step 11] Verifying active friendship list & online presence...');
    const aliceFriends = await request('/friends', { headers: aliceHeaders });
    const bobFriends = await request('/friends', { headers: bobHeaders });

    const aliceFriendItem = aliceFriends.data?.data?.find((f) => f.id === bobId);
    const bobFriendItem = bobFriends.data?.data?.find((f) => f.id === aliceId);

    if (!aliceFriendItem) {
      throw new Error('Bob not found in Alice friends list');
    }
    if (!bobFriendItem) {
      throw new Error('Alice not found in Bob friends list');
    }

    console.log(`✅ Bob online status seen by Alice: ${aliceFriendItem.isOnline}`);
    console.log(`✅ Alice online status seen by Bob: ${bobFriendItem.isOnline}`);
    if (!aliceFriendItem.isOnline || !bobFriendItem.isOnline) {
      throw new Error('Both players are connected to WebSocket and should be marked isOnline: true');
    }

    // Check friendship status lookup
    const statusRes = await request(`/friends/status/${bobId}`, { headers: aliceHeaders });
    console.log('✅ Friendship status:', JSON.stringify(statusRes.data));
    if (statusRes.data?.data?.status !== 'ACCEPTED') {
      throw new Error(`Expected status ACCEPTED, got: ${statusRes.data?.data?.status}`);
    }

    // ========================================================
    // 12. Notification Read Status Management
    // ========================================================
    console.log('\n🐰 [Step 12] Testing notification read & mark-all-read flow...');
    if (notiId) {
      const readOneRes = await request(`/notifications/${notiId}/read`, {
        method: 'PATCH',
        headers: bobHeaders,
      });
      if (readOneRes.status !== 200 || readOneRes.data?.data?.isRead !== true) {
        throw new Error('Failed to mark notification as read');
      }
      console.log('✅ Single notification marked read successfully');
    }

    await request('/notifications/read-all', {
      method: 'PATCH',
      headers: bobHeaders,
    });
    const unreadAfterReadAll = await request('/notifications/unread-count', { headers: bobHeaders });
    console.log(`✅ Bob unread count after read-all: ${unreadAfterReadAll.data?.data?.unreadCount}`);
    if (unreadAfterReadAll.data?.data?.unreadCount !== 0) {
      throw new Error('Expected 0 unread notifications after read-all');
    }

    // ========================================================
    // 13. Reverse Request Auto-Accept Test
    // ========================================================
    console.log('\n🐰 [Step 13] Testing reverse request auto-accept (Carol & Dave)...');
    const carolReg = await request('/auth/register', {
      method: 'POST',
      body: {
        email: `carol_${timestamp}@bunny.test`,
        password: 'Password123!',
        displayName: 'Carol Bunny',
      },
    });
    const carolToken = carolReg.data.data.accessToken;
    const carolId = carolReg.data.data.user.id;
    const carolHeaders = { Authorization: `Bearer ${carolToken}` };

    const daveReg = await request('/auth/register', {
      method: 'POST',
      body: {
        email: `dave_${timestamp}@bunny.test`,
        password: 'Password123!',
        displayName: 'Dave Bunny',
      },
    });
    const daveToken = daveReg.data.data.accessToken;
    const daveId = daveReg.data.data.user.id;
    const daveHeaders = { Authorization: `Bearer ${daveToken}` };

    // Carol sends request to Dave
    await request('/friends/request', {
      method: 'POST',
      headers: carolHeaders,
      body: { target: daveId },
    });

    // Dave sends request back to Carol -> Should auto-accept!
    const autoAcceptRes = await request('/friends/request', {
      method: 'POST',
      headers: daveHeaders,
      body: { target: carolId },
    });
    console.log('✅ Reverse request result:', JSON.stringify(autoAcceptRes.data));
    if (autoAcceptRes.data?.code !== 'friend_request_accepted') {
      throw new Error(`Expected reverse request to auto-accept with friend_request_accepted, got: ${autoAcceptRes.data?.code}`);
    }

    // Verify Carol and Dave are friends now
    const carolFriends = await request('/friends', { headers: carolHeaders });
    if (!carolFriends.data?.data?.some((f) => f.id === daveId)) {
      throw new Error('Dave is not in Carol friends list after auto-accept');
    }
    console.log('🎉 Reverse friend request auto-accepted and verified successfully!');

    // ========================================================
    // 14. Unfriend Flow
    // ========================================================
    console.log('\n🐰 [Step 14] Testing unfriend (Alice unfriends Bob)...');
    const unfriendRes = await request(`/friends/${bobId}`, {
      method: 'DELETE',
      headers: aliceHeaders,
    });
    console.log('✅ Unfriend response:', JSON.stringify(unfriendRes.data));
    if (unfriendRes.status !== 200 || unfriendRes.data?.code !== 'unfriended_successful') {
      throw new Error(`Failed to unfriend: ${JSON.stringify(unfriendRes.data)}`);
    }

    const aliceFriendsAfter = await request('/friends', { headers: aliceHeaders });
    const bobFriendsAfter = await request('/friends', { headers: bobHeaders });
    if (aliceFriendsAfter.data?.data?.some((f) => f.id === bobId)) {
      throw new Error('Bob still present in Alice friends list after unfriend');
    }
    if (bobFriendsAfter.data?.data?.some((f) => f.id === aliceId)) {
      throw new Error('Alice still present in Bob friends list after unfriend');
    }

    const statusAfterUnfriend = await request(`/friends/status/${bobId}`, { headers: aliceHeaders });
    if (statusAfterUnfriend.data?.data?.status !== 'NONE') {
      throw new Error(`Expected status NONE after unfriend, got: ${statusAfterUnfriend.data?.data?.status}`);
    }
    console.log('🎉 Unfriend verified successfully! Both friends lists cleared.');

    // ========================================================
    // 14b. Test Clearing FCM Token (Logout)
    // ========================================================
    console.log('\n🐰 [Step 14b] Testing clearing FCM token on logout...');
    const clearFcmRes = await request('/notifications/fcm-token', {
      method: 'DELETE',
      headers: bobHeaders,
    });
    console.log('✅ FCM token cleared response:', JSON.stringify(clearFcmRes.data));
    if (clearFcmRes.status !== 200 || clearFcmRes.data?.code !== 'fcm_token_cleared') {
      throw new Error(`Failed to clear FCM token: ${JSON.stringify(clearFcmRes.data)}`);
    }

    console.log('\n======================================================');
    console.log('🌟 ALL FRIENDS, NOTIFICATIONS & FCM TESTS PASSED 100%! 🌟');
    console.log('======================================================\n');
  } finally {
    if (aliceSocket) aliceSocket.disconnect();
    if (bobSocket) bobSocket.disconnect();
    child.kill();
    console.log('🛑 Server stopped cleanly.');
  }
}

runFriendsNotificationsSuite().catch((err) => {
  console.error('\n❌ FRIENDS & NOTIFICATIONS TEST SUITE FAILED:', err);
  process.exit(1);
});
