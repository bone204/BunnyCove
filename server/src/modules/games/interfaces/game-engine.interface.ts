import { Player } from '../../room/interfaces/room.interface.js';

export interface GameActionResult<TState = any, TDetails = any> {
  success: boolean;
  code: string;
  error?: string;
  state?: TState;
  nextTurnPlayerId?: string;
  isGameOver?: boolean;
  winnerId?: string | null; // null for draw, undefined if ongoing
  winningDetails?: TDetails;
}

export interface GameInfo {
  type: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
}

export interface IGameEngine<TState = any> {
  readonly gameType: string;
  readonly name: string;
  readonly description: string;
  readonly minPlayers: number;
  readonly maxPlayers: number;

  /**
   * Initializes the game state when the game starts.
   */
  initGame(players: Player[], config?: any): TState;

  /**
   * Processes a player action (e.g., place stone, call number, roll dice).
   */
  handleAction(
    state: TState,
    player: Player,
    actionType: string,
    payload: any,
  ): GameActionResult<TState>;

  /**
   * Serializes the game state for a specific player (useful for fog-of-war or private boards).
   */
  serializeState(state: TState, forPlayerId?: string): any;
}
