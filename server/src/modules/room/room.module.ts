import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway.js';
import { RoomService } from './room.service.js';

@Module({
  providers: [RoomGateway, RoomService],
  exports: [RoomService],
})
export class RoomModule {}
