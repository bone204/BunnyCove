import { Injectable, Logger } from '@nestjs/common';
import { IGameEngine, GameInfo } from './interfaces/game-engine.interface.js';

@Injectable()
export class GameRegistryService {
  private readonly logger = new Logger(GameRegistryService.name);
  private readonly engines: Map<string, IGameEngine> = new Map();

  registerEngine(engine: IGameEngine): void {
    const key = engine.gameType.toLowerCase();
    if (this.engines.has(key)) {
      this.logger.warn(`Overwriting game engine for type: ${key}`);
    }
    this.engines.set(key, engine);
    this.logger.log(`Registered game engine: [${engine.name}] (type: ${key})`);
  }

  getEngine(gameType: string): IGameEngine | undefined {
    return this.engines.get(gameType.toLowerCase());
  }

  listAvailableGames(): GameInfo[] {
    return Array.from(this.engines.values()).map((engine) => ({
      type: engine.gameType,
      name: engine.name,
      description: engine.description,
      minPlayers: engine.minPlayers,
      maxPlayers: engine.maxPlayers,
    }));
  }
}
