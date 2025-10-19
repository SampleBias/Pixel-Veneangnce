export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP';
export interface Position {
  x: number;
  y: number;
}
export interface Player {
  id: number;
  name: string;
  position: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  lives: number;
  isStunned: number; // countdown timer
  ammo: number;
  ammoRechargeTimer?: number;
  color: string;
}
export type GhostType = 'BLINKY' | 'PINKY' | 'INKY' | 'CLYDE';
export interface Ghost {
  id: string;
  type: GhostType;
  position: Position;
  direction: Direction;
  isVulnerable: number; // countdown timer
  isEaten: boolean;
  color: string;
}
export interface Projectile {
  id: string;
  position: Position;
  direction: Direction;
  playerId: number;
}
export type Pellet = {
  position: Position;
  isPowerPellet: boolean;
};
export type GameStatus = 'MODE_SELECTION' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
export interface GameState {
  status: GameStatus;
  gameMode: '1P' | '2P' | null;
  maze: number[][];
  players: [Player, Player];
  ghosts: Ghost[];
  projectiles: Projectile[];
  pellets: Pellet[];
  highScore: number;
  winner: number | null;
}
export interface GameActions {
  setDirection: (playerId: number, direction: Direction) => void;
  shoot: (playerId: number) => void;
  update: (delta: number) => void;
  startGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  respawnGhost: (ghostId: string) => void;
  setPlayerName: (playerId: number, name: string) => void;
  setGameMode: (mode: '1P' | '2P') => void;
}