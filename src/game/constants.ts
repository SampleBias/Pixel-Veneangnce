import { Ghost, GhostType, Player } from './types';
export const TILE_SIZE = 20;
export const PLAYER_SPEED = 2; // tiles per second
export const GHOST_SPEED = 1.8;
export const PROJECTILE_SPEED = 8;
export const STUN_DURATION = 2000; // ms
export const VULNERABLE_DURATION = 8000; // ms
export const MAX_AMMO = 5;
export const AMMO_RECHARGE_RATE = 1000; // ms per ammo
export const PLAYER_COLORS = {
  P1: '#FFFF00', // pac-yellow
  P2: '#00FFFF', // pac-cyan
};
export const GHOST_COLORS: Record<GhostType, string> = {
  BLINKY: '#FF0000', // ghost-red
  PINKY: '#FF00FF', // ghost-pink
  INKY: '#00FFFF', // pac-cyan (same as P2)
  CLYDE: '#FFA500', // ghost-orange
};
export const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// 0: Empty, 1: Wall, 2: Pellet, 3: Power Pellet
export const INITIAL_PLAYER_1: Player = {
  id: 1,
  name: 'PLAYER 1',
  position: { x: 1, y: 1 },
  direction: 'STOP',
  nextDirection: 'STOP',
  score: 0,
  lives: 3,
  isStunned: 0,
  ammo: MAX_AMMO,
  color: PLAYER_COLORS.P1,
};
export const INITIAL_PLAYER_2: Player = {
  id: 2,
  name: 'PLAYER 2',
  position: { x: 17, y: 1 },
  direction: 'STOP',
  nextDirection: 'STOP',
  score: 0,
  lives: 3,
  isStunned: 0,
  ammo: MAX_AMMO,
  color: PLAYER_COLORS.P2,
};
export const INITIAL_GHOSTS: Ghost[] = [
  { id: 'g1', type: 'BLINKY', position: { x: 9, y: 8 }, direction: 'UP', isVulnerable: 0, isEaten: false, color: GHOST_COLORS.BLINKY },
  { id: 'g2', type: 'PINKY', position: { x: 9, y: 10 }, direction: 'UP', isVulnerable: 0, isEaten: false, color: GHOST_COLORS.PINKY },
  { id: 'g3', type: 'INKY', position: { x: 8, y: 10 }, direction: 'UP', isVulnerable: 0, isEaten: false, color: GHOST_COLORS.INKY },
  { id: 'g4', type: 'CLYDE', position: { x: 10, y: 10 }, direction: 'UP', isVulnerable: 0, isEaten: false, color: GHOST_COLORS.CLYDE },
];