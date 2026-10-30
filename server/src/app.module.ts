import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { RedisModule } from './common/redis/redis.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { RoomModule } from './modules/room/room.module.js';
import { GamesModule } from './modules/games/games.module.js';
import { EmailModule } from './modules/email/email.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { FriendsModule } from './modules/friends/friends.module.js';
import { ChatModule } from './modules/chat/chat.module.js';
import { FirebaseModule } from './common/firebase/firebase.module.js';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    FirebaseModule,
    EmailModule,
    AuthModule,
    UsersModule,
    NotificationsModule,
    FriendsModule,
    UploadModule,
    GamesModule,
    RoomModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

