import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module.js';
import { io } from 'socket.io-client';

async function runTest() {
  console.log('🚀 Starting NestJS test server on port 3099...');
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(3099);

  try {
    console.log('🐰 Connecting Player 1 (Host)...');
    const player1 = io('http://localhost:3099', { transports: ['websocket'] });
    await new Promise((res) => player1.on('connect', res));
    console.log('✅ Player 1 connected');

    // 1. Player 1 creates room
    const createResult = await new Promise((res) => {
      player1.emit('room:create', { playerName: 'BunnyWhite' }, res);
    });
    console.log('✅ Room created:', JSON.stringify(createResult));
    if (!createResult.success || !createResult.data?.code) {
      throw new Error('Failed to create room');
    }
    const roomCode = createResult.data.code;

    // 2. Player 2 connects and joins room
    console.log(`🐰 Connecting Player 2 (Guest) to room ${roomCode}...`);
    const player2 = io('http://localhost:3099', { transports: ['websocket'] });
    await new Promise((res) => player2.on('connect', res));

    const joinResult = await new Promise((res) => {
      player2.emit('room:join', { roomCode, playerName: 'BunnyPink' }, res);
    });
    console.log('✅ Player 2 joined:', JSON.stringify(joinResult));
    if (!joinResult.success || joinResult.data?.players.length !== 2) {
      throw new Error('Failed to join room or invalid player count');
    }

    // 3. Player 1 marks Ready
    console.log('🐰 Player 1 setting Ready...');
    const p1ReadyPromise = new Promise((res) => player2.on('room:ready_update', res));
    player1.emit('room:ready', { roomCode, isReady: true });
    await p1ReadyPromise;
    console.log('✅ Player 1 ready recorded');

    // 4. Player 2 marks Ready -> bothReady
    console.log('🐰 Player 2 setting Ready...');
    const bothReadyPromise = new Promise((res) => player1.on('room:ready_update', res));
    player2.emit('room:ready', { roomCode, isReady: true });
    const bothReadyEvent = await bothReadyPromise;
    console.log('✅ Both players ready event received:', JSON.stringify(bothReadyEvent));

    if (bothReadyEvent.code !== 'room_both_ready') {
      throw new Error(`Expected room_both_ready, got: ${bothReadyEvent.code}`);
    }

    console.log('🎉 ALL 2-PLAYER ROOM WEBSOCKET TESTS PASSED SUCCESSFULLY!');
    player1.disconnect();
    player2.disconnect();
  } finally {
    await app.close();
    console.log('🛑 Test server stopped cleanly.');
  }
}

runTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
