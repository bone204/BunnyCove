import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module.js';
import { io } from 'socket.io-client';

const PORT = 3096;
const BASE_URL = `http://localhost:${PORT}`;

async function runTest() {
  console.log(`🚀 Starting NestJS test server on port ${PORT}...`);
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(PORT);

  try {
    // ----------------------------------------------------
    // STEP 1: Verify REST Sticker Catalog Endpoint
    // ----------------------------------------------------
    console.log('\n📦 Step 1: Fetching Bunny sticker catalog via REST API...');
    const stickersRes = await fetch(`${BASE_URL}/chat/stickers`);
    const stickersJson = await stickersRes.json();
    console.log('✅ Sticker Catalog Response Code:', stickersJson.code);

    if (stickersJson.code !== 'stickers_fetched' || !stickersJson.data?.stickers) {
      throw new Error(`Failed to fetch stickers catalog: ${JSON.stringify(stickersJson)}`);
    }

    const { stickers, quickReactions } = stickersJson.data;
    console.log(`✅ Loaded ${stickers.length} Bunny stickers and ${quickReactions.length} quick reactions`);
    if (stickers.length < 5 || quickReactions.length < 3) {
      throw new Error('Insufficient stickers or quick reactions returned');
    }

    // ----------------------------------------------------
    // STEP 2: Connect 2 WebSocket Clients (Host & Guest)
    // ----------------------------------------------------
    console.log('\n🐰 Step 2: Connecting 2 WebSocket players to server...');
    const hostSocket = io(BASE_URL, { transports: ['websocket'] });
    const guestSocket = io(BASE_URL, { transports: ['websocket'] });

    await Promise.all([
      new Promise((res) => hostSocket.on('connect', res)),
      new Promise((res) => guestSocket.on('connect', res)),
    ]);
    console.log('✅ Both players connected via WebSocket');

    // Host creates room
    const createRes = await new Promise((res) => {
      hostSocket.emit('room:create', { playerName: 'CaptainBunny', avatarId: 'bunny-host-avatar' }, res);
    });
    if (!createRes.success || !createRes.data?.code) {
      throw new Error('Failed to create room');
    }
    const roomCode = createRes.data.code;
    console.log(`✅ Room created successfully with code: ${roomCode}`);

    // Guest joins room
    const joinRes = await new Promise((res) => {
      guestSocket.emit('room:join', { roomCode, playerName: 'FluffyGuest', avatarId: 'bunny-guest-avatar' }, res);
    });
    if (!joinRes.success) {
      throw new Error(`Guest failed to join room: ${JSON.stringify(joinRes)}`);
    }
    console.log(`✅ FluffyGuest joined room ${roomCode}`);

    // ----------------------------------------------------
    // STEP 3: Realtime Text Chat Messaging
    // ----------------------------------------------------
    console.log('\n💬 Step 3: Testing in-room realtime text chat...');
    const hostText = 'Welcome to Bunny Cove! Ready for a cozy match? 🐰';

    // Guest listens for realtime incoming chat
    const guestReceivedTextPromise = new Promise((resolve) => {
      guestSocket.on('chat:new_message', (msg) => {
        if (msg.data?.type === 'TEXT') {
          resolve(msg);
        }
      });
    });

    const sendTextAck = await new Promise((res) => {
      hostSocket.emit('chat:send_message', { text: hostText }, res);
    });
    console.log('✅ Host text message sent ack:', sendTextAck.code);

    const receivedTextMessage = await guestReceivedTextPromise;
    console.log('✅ Guest received realtime text message:', JSON.stringify(receivedTextMessage.data));

    if (receivedTextMessage.data.content !== hostText || receivedTextMessage.data.senderName !== 'CaptainBunny') {
      throw new Error('Text message content or sender mismatched');
    }
    const textMessageId = receivedTextMessage.data.id;

    // ----------------------------------------------------
    // STEP 4: Realtime Bunny Sticker Transmission
    // ----------------------------------------------------
    console.log('\n🐰 Step 4: Testing Bunny sticker transmission...');
    const stickerToSend = 'bunny_love';

    // Host listens for realtime incoming sticker
    const hostReceivedStickerPromise = new Promise((resolve) => {
      hostSocket.on('chat:new_message', (msg) => {
        if (msg.data?.type === 'STICKER') {
          resolve(msg);
        }
      });
    });

    const sendStickerAck = await new Promise((res) => {
      guestSocket.emit('chat:send_message', { stickerId: stickerToSend }, res);
    });
    console.log('✅ Guest sticker sent ack:', sendStickerAck.code);

    const receivedStickerMessage = await hostReceivedStickerPromise;
    console.log('✅ Host received realtime sticker message:', JSON.stringify(receivedStickerMessage.data));

    if (
      receivedStickerMessage.data.type !== 'STICKER' ||
      receivedStickerMessage.data.content !== stickerToSend ||
      receivedStickerMessage.data.senderName !== 'FluffyGuest' ||
      !receivedStickerMessage.data.sticker?.imageUrl
    ) {
      throw new Error('Sticker message content, sticker metadata, or sender mismatched');
    }
    const stickerMessageId = receivedStickerMessage.data.id;

    // ----------------------------------------------------
    // STEP 5: Validation & Error Handling (Send)
    // ----------------------------------------------------
    console.log('\n🛡️ Step 5: Testing chat send validation...');

    // 5a. Empty message
    const emptyAck = await new Promise((res) => {
      hostSocket.emit('chat:send_message', { text: '   ' }, res);
    });
    console.log('✅ Empty text rejected with code:', emptyAck.error?.code);
    if (emptyAck.error?.code !== 'chat_message_empty') {
      throw new Error(`Expected chat_message_empty error, got: ${JSON.stringify(emptyAck)}`);
    }

    // 5b. Invalid sticker
    const invalidStickerAck = await new Promise((res) => {
      hostSocket.emit('chat:send_message', { stickerId: 'bunny_nonexistent_999' }, res);
    });
    console.log('✅ Invalid sticker rejected with code:', invalidStickerAck.error?.code);
    if (invalidStickerAck.error?.code !== 'invalid_sticker') {
      throw new Error(`Expected invalid_sticker error, got: ${JSON.stringify(invalidStickerAck)}`);
    }

    // ----------------------------------------------------
    // STEP 6: Realtime Edit Message Flow
    // ----------------------------------------------------
    console.log('\n✏️ Step 6: Testing realtime chat editing...');
    const updatedContent = 'Updated: Welcome to Bunny Cove! Let the games begin! 🥕';

    // Guest listens for realtime message_edited event
    const guestReceivedEditPromise = new Promise((resolve) => {
      guestSocket.on('chat:message_edited', (msg) => {
        resolve(msg);
      });
    });

    const editAck = await new Promise((res) => {
      hostSocket.emit('chat:edit_message', { messageId: textMessageId, text: updatedContent }, res);
    });
    console.log('✅ Host edit ack:', editAck.code);

    const guestReceivedEdit = await guestReceivedEditPromise;
    console.log('✅ Guest received realtime edited message:', JSON.stringify(guestReceivedEdit.data));

    if (
      guestReceivedEdit.data.content !== updatedContent ||
      guestReceivedEdit.data.isEdited !== true ||
      !guestReceivedEdit.data.editedAt
    ) {
      throw new Error('Edited message verification failed');
    }

    // ----------------------------------------------------
    // STEP 7: Edit Security & Validation Rejections
    // ----------------------------------------------------
    console.log('\n🛡️ Step 7: Testing edit permissions and negative scenarios...');

    // 7a. Guest tries to edit Host's message (Not owner)
    const unauthorizedEditAck = await new Promise((res) => {
      guestSocket.emit('chat:edit_message', { messageId: textMessageId, text: 'Hacked by Guest!' }, res);
    });
    console.log('✅ Non-owner edit rejected with code:', unauthorizedEditAck.error?.code);
    if (unauthorizedEditAck.error?.code !== 'chat_not_message_owner') {
      throw new Error(`Expected chat_not_message_owner, got: ${JSON.stringify(unauthorizedEditAck)}`);
    }

    // 7b. Host tries to edit a sticker message
    const editStickerAck = await new Promise((res) => {
      hostSocket.emit('chat:edit_message', { messageId: stickerMessageId, text: 'Change sticker to text' }, res);
    });
    console.log('✅ Editing sticker rejected with code:', editStickerAck.error?.code);
    if (editStickerAck.error?.code !== 'chat_cannot_edit_sticker') {
      throw new Error(`Expected chat_cannot_edit_sticker, got: ${JSON.stringify(editStickerAck)}`);
    }

    // ----------------------------------------------------
    // STEP 8: Realtime Delete / Recall Message Flow
    // ----------------------------------------------------
    console.log('\n🗑️ Step 8: Testing realtime chat recall / deletion...');

    // Host listens for realtime message_deleted event
    const hostReceivedDeletePromise = new Promise((resolve) => {
      hostSocket.on('chat:message_deleted', (msg) => {
        resolve(msg);
      });
    });

    // Guest recalls/deletes their sticker message
    const deleteAck = await new Promise((res) => {
      guestSocket.emit('chat:delete_message', { messageId: stickerMessageId }, res);
    });
    console.log('✅ Guest delete ack:', deleteAck.code);

    const hostReceivedDelete = await hostReceivedDeletePromise;
    console.log('✅ Host received realtime deleted message notification:', JSON.stringify(hostReceivedDelete.data));

    if (hostReceivedDelete.data.messageId !== stickerMessageId || hostReceivedDelete.data.isDeleted !== true) {
      throw new Error('Deleted message verification failed');
    }

    // ----------------------------------------------------
    // STEP 9: Delete Permissions & Negative Scenarios
    // ----------------------------------------------------
    console.log('\n🛡️ Step 9: Testing delete permissions and negative scenarios...');

    // 9a. Non-existent message deletion
    const notFoundDeleteAck = await new Promise((res) => {
      hostSocket.emit('chat:delete_message', { messageId: '00000000-0000-0000-0000-000000000000' }, res);
    });
    console.log('✅ Non-existent message delete rejected with code:', notFoundDeleteAck.error?.code);
    if (notFoundDeleteAck.error?.code !== 'chat_message_not_found') {
      throw new Error(`Expected chat_message_not_found, got: ${JSON.stringify(notFoundDeleteAck)}`);
    }

    // 9b. Guest tries to delete Host's text message
    const unauthorizedDeleteAck = await new Promise((res) => {
      guestSocket.emit('chat:delete_message', { messageId: textMessageId }, res);
    });
    console.log('✅ Non-owner delete rejected with code:', unauthorizedDeleteAck.error?.code);
    if (unauthorizedDeleteAck.error?.code !== 'chat_not_message_owner') {
      throw new Error(`Expected chat_not_message_owner, got: ${JSON.stringify(unauthorizedDeleteAck)}`);
    }

    // ----------------------------------------------------
    // STEP 10: REST Chat History Retrieval & Persistence Check
    // ----------------------------------------------------
    console.log('\n📜 Step 10: Verifying updated and deleted chat history via REST API...');
    const historyRes = await fetch(`${BASE_URL}/chat/rooms/${roomCode}/messages`);
    const historyJson = await historyRes.json();
    console.log('✅ Chat history response code:', historyJson.code);
    console.log(`✅ Retrieved ${historyJson.data?.messages?.length} messages from room history`);

    if (historyJson.code !== 'chat_history_fetched' || historyJson.data?.total < 2) {
      throw new Error(`Failed to fetch room messages: ${JSON.stringify(historyJson)}`);
    }

    const messages = historyJson.data.messages;
    const textMsg = messages.find((m) => m.id === textMessageId);
    const stickerMsg = messages.find((m) => m.id === stickerMessageId);

    if (!textMsg || textMsg.isEdited !== true || textMsg.content !== updatedContent) {
      throw new Error('Edited text message not correctly reflected in persistent history');
    }
    if (!stickerMsg || stickerMsg.isDeleted !== true || stickerMsg.content !== 'This message was deleted') {
      throw new Error('Recalled sticker message not correctly reflected in persistent history');
    }
    console.log('✅ Both edited and recalled message states verified in persistent storage!');

    console.log('\n🎉 ALL REALTIME IN-ROOM CHAT, STICKERS, EDIT & RECALL TESTS PASSED CLEANLY! 🎉');

    // Cleanup sockets first
    hostSocket.disconnect();
    guestSocket.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 200));
  } finally {
    await app.close();
    console.log('🛑 Test server stopped cleanly.');
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

runTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ CHAT TEST SUITE FAILED:', err);
    process.exit(1);
  });
