import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { RedisModule } from './common/redis/redis.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { RoomModule } from './modules/room/room.module.js';
import { GamesModule } from './modules/games/games.module.js';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    UploadModule,
    GamesModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

