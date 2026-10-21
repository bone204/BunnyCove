import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RoomModule } from './modules/room/room.module.js';
import { GamesModule } from './modules/games/games.module.js';

@Module({
  imports: [GamesModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
