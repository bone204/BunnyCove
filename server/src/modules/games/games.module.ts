import { Module, Global } from '@nestjs/common';
import { GameRegistryService } from './game-registry.service.js';

@Global()
@Module({
  providers: [GameRegistryService],
  exports: [GameRegistryService],
})
export class GamesModule {}
