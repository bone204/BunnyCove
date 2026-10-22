import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationsGateway } from './notifications.gateway.js';
import { PrismaModule } from '../../common/prisma/prisma.module.js';
import { FirebaseModule } from '../../common/firebase/firebase.module.js';

@Module({
  imports: [PrismaModule, FirebaseModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
