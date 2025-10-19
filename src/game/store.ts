import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { GameState, GameActions, Direction, Pellet, Player, Ghost, GhostType, Position } from './types';
import {
  MAZE_LAYOUT,
  INITIAL_PLAYER_1,
  INITIAL_PLAYER_2,
  INITIAL_GHOSTS,
  PLAYER_SPEED,
  PROJECTILE_SPEED,
  STUN_DURATION,
  VULNERABLE_DURATION,
  MAX_AMMO,
  AMMO_RECHARGE_RATE,
  GHOST_SPEED,
} from './constants';
import { playSound } from './sounds';
const createInitialPellets = (): Pellet[] => {
  const pellets: Pellet[] = [];
  MAZE_LAYOUT.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === 2 || tile === 3) {
        pellets.push({
          position: { x, y },
          isPowerPellet: tile === 3,
        });
      }
    });
  });
  return pellets;
};
const getInitialState = (): GameState => ({
  status: 'MODE_SELECTION',
  gameMode: null,
  maze: MAZE_LAYOUT,
  players: [JSON.parse(JSON.stringify(INITIAL_PLAYER_1)), JSON.parse(JSON.stringify(INITIAL_PLAYER_2))],
  ghosts: JSON.parse(JSON.stringify(INITIAL_GHOSTS)),
  projectiles: [],
  pellets: createInitialPellets(),
  highScore: 0,
  winner: null,
});
const isWall = (x: number, y: number, maze: number[][]) => {
  const gridX = Math.floor(x);
  const gridY = Math.floor(y);
  if (gridX < 0 || gridX >= maze[0].length || gridY < 0 || gridY >= maze.length) return true;
  return maze[gridY][gridX] === 1;
};
const oppositeDirection: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT', STOP: 'STOP' };
export const useGameStore = create<GameState & GameActions>()(
  immer((set, get) => ({
    ...getInitialState(),
    setPlayerName: (playerId, name) => {
      set((state) => {
        const player = state.players.find((p) => p.id === playerId);
        if (player) {
          player.name = name;
        }
      });
    },
    setGameMode: (mode) => {
      set({ gameMode: mode });
    },
    setDirection: (playerId, direction) => {
      set((state) => {
        const player = state.players.find((p) => p.id === playerId);
        if (player) {
          player.nextDirection = direction;
        }
      });
    },
    shoot: (playerId) => {
      const player = get().players.find((p) => p.id === playerId);
      if (player && player.ammo > 0 && player.direction !== 'STOP' && player.isStunned <= 0) {
        playSound('shoot');
        set((state) => {
          const p = state.players.find((pl) => pl.id === playerId)!;
          p.ammo--;
          state.projectiles.push({
            id: uuidv4(),
            position: { ...p.position },
            direction: p.direction,
            playerId,
          });
        });
      }
    },
    startGame: () => {
      const status = get().status;
      if (status === 'MODE_SELECTION' || status === 'PAUSED') {
        playSound('gameStart');
        set({ status: 'PLAYING' });
      }
    },
    resetGame: () => {
      set((state) => {
        const currentHighScore = state.highScore;
        Object.assign(state, getInitialState());
        state.highScore = currentHighScore;
        state.status = 'MODE_SELECTION';
      });
    },
    pauseGame: () => {
      set((state) => {
        if (state.status === 'PLAYING') {
          state.status = 'PAUSED';
        }
      });
    },
    respawnGhost: (ghostId) => {
      set((state) => {
        const ghost = state.ghosts.find((g) => g.id === ghostId);
        if (ghost) {
          ghost.position = { x: 9, y: 10 };
          ghost.isEaten = false;
        }
      });
    },
    update: (delta) => {
      if (get().status !== 'PLAYING') return;
      const deltaSeconds = delta / 1000;
      set((state) => {
        // Update timers and ammo
        state.players.forEach((p, index) => {
          if (state.gameMode === '1P' && index === 1) return;
          if (p.isStunned > 0) p.isStunned = Math.max(0, p.isStunned - delta);
          if (p.ammo < MAX_AMMO) {
            p.ammoRechargeTimer = (p.ammoRechargeTimer || 0) + delta;
            if (p.ammoRechargeTimer >= AMMO_RECHARGE_RATE) {
              p.ammo++;
              p.ammoRechargeTimer = 0;
            }
          }
        });
        state.ghosts.forEach(g => {
          if (g.isVulnerable > 0) g.isVulnerable = Math.max(0, g.isVulnerable - delta);
        });
        // Move Players
        state.players.forEach((player, index) => {
          if (state.gameMode === '1P' && index === 1) return;
          if (player.isStunned > 0) return;
          const speed = PLAYER_SPEED * deltaSeconds;
          const tolerance = speed > 0 ? speed * 0.51 : 0.05;
          const { x, y } = player.position;
          const isAtIntersection = Math.abs(x - Math.round(x)) < tolerance && Math.abs(y - Math.round(y)) < tolerance;
          if (isAtIntersection) {
            player.position.x = Math.round(x);
            player.position.y = Math.round(y);
            const canMove = (dir: Direction) => {
              switch (dir) {
                case 'UP': return !isWall(player.position.x, player.position.y - 1, state.maze);
                case 'DOWN': return !isWall(player.position.x, player.position.y + 1, state.maze);
                case 'LEFT': return !isWall(player.position.x - 1, player.position.y, state.maze);
                case 'RIGHT': return !isWall(player.position.x + 1, player.position.y, state.maze);
                default: return false;
              }
            };
            if (player.nextDirection !== player.direction && player.nextDirection !== oppositeDirection[player.direction] && canMove(player.nextDirection)) {
              player.direction = player.nextDirection;
            }
          }
          let nextX = player.position.x;
          let nextY = player.position.y;
          switch (player.direction) {
            case 'UP': nextY -= speed; break;
            case 'DOWN': nextY += speed; break;
            case 'LEFT': nextX -= speed; break;
            case 'RIGHT': nextX += speed; break;
          }
          const currentTileX = Math.round(player.position.x);
          const currentTileY = Math.round(player.position.y);
          let collision = false;
          switch (player.direction) {
            case 'UP':
              if (isWall(currentTileX, Math.floor(nextY), state.maze) && nextY < currentTileY) {
                player.position.y = currentTileY;
                collision = true;
              }
              break;
            case 'DOWN':
              if (isWall(currentTileX, Math.ceil(nextY), state.maze) && nextY > currentTileY) {
                player.position.y = currentTileY;
                collision = true;
              }
              break;
            case 'LEFT':
              if (isWall(Math.floor(nextX), currentTileY, state.maze) && nextX < currentTileX) {
                player.position.x = currentTileX;
                collision = true;
              }
              break;
            case 'RIGHT':
              if (isWall(Math.ceil(nextX), currentTileY, state.maze) && nextX > currentTileX) {
                player.position.x = currentTileX;
                collision = true;
              }
              break;
          }
          if (collision) {
            player.direction = 'STOP';
          } else {
            player.position.x = nextX;
            player.position.y = nextY;
          }
          // Handle tunnel wrapping
          if (player.position.x < -0.5) player.position.x = state.maze[0].length - 0.51;
          if (player.position.x > state.maze[0].length - 0.5) player.position.x = -0.49;
        });
        // Move Ghosts with AI
        state.ghosts.forEach((ghost) => {
            const { x, y } = ghost.position;
            const speed = (ghost.isVulnerable > 0 ? GHOST_SPEED * 0.75 : GHOST_SPEED) * deltaSeconds;
            const tolerance = speed > 0 ? speed * 0.51 : 0.05;
            const isAtIntersection = Math.abs(x - Math.round(x)) < tolerance && Math.abs(y - Math.round(y)) < tolerance;
            if (isAtIntersection) {
                ghost.position.x = Math.round(x);
                ghost.position.y = Math.round(y);
                let target: Position = { x: 0, y: 0 };
                const p1 = state.players[0];
                const blinkyPos = state.ghosts.find(g => g.type === 'BLINKY')?.position;
                switch (ghost.type) {
                    case 'BLINKY': target = p1.position; break;
                    case 'PINKY':
                        target = { ...p1.position };
                        switch (p1.direction) {
                            case 'UP': target.y -= 4; break;
                            case 'DOWN': target.y += 4; break;
                            case 'LEFT': target.x -= 4; break;
                            case 'RIGHT': target.x += 4; break;
                        }
                        break;
                    case 'INKY':
                        if (blinkyPos) {
                            const vectorX = (p1.position.x - blinkyPos.x) * 2;
                            const vectorY = (p1.position.y - blinkyPos.y) * 2;
                            target = { x: blinkyPos.x + vectorX, y: blinkyPos.y + vectorY };
                        } else {
                            target = p1.position;
                        }
                        break;
                    case 'CLYDE': {
                        const distance = Math.hypot(ghost.position.x - p1.position.x, ghost.position.y - p1.position.y);
                        if (distance < 8) {
                            target = { x: 0, y: state.maze.length - 1 };
                        } else {
                            target = p1.position;
                        }
                        break;
                    }
                }
                if (ghost.isVulnerable > 0) {
                    target = { x: Math.random() * 20, y: Math.random() * 20 };
                }
                const possibleDirections: Direction[] = [];
                if (!isWall(ghost.position.x, ghost.position.y - 1, state.maze)) possibleDirections.push('UP');
                if (!isWall(ghost.position.x, ghost.position.y + 1, state.maze)) possibleDirections.push('DOWN');
                if (!isWall(ghost.position.x - 1, ghost.position.y, state.maze)) possibleDirections.push('LEFT');
                if (!isWall(ghost.position.x + 1, ghost.position.y, state.maze)) possibleDirections.push('RIGHT');
                const filteredDirections = possibleDirections.filter(d => d !== oppositeDirection[ghost.direction]);
                let bestDirection = ghost.direction;
                let minDistance = Infinity;
                const directionsToEvaluate = filteredDirections.length > 0 ? filteredDirections : possibleDirections;
                for (const dir of directionsToEvaluate) {
                    let nextPos = { ...ghost.position };
                    if (dir === 'UP') nextPos.y--;
                    if (dir === 'DOWN') nextPos.y++;
                    if (dir === 'LEFT') nextPos.x--;
                    if (dir === 'RIGHT') nextPos.x++;
                    const distance = Math.hypot(nextPos.x - target.x, nextPos.y - target.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestDirection = dir;
                    }
                }
                ghost.direction = bestDirection;
            }
            let nextX = ghost.position.x;
            let nextY = ghost.position.y;
            switch (ghost.direction) {
                case 'UP': nextY -= speed; break;
                case 'DOWN': nextY += speed; break;
                case 'LEFT': nextX -= speed; break;
                case 'RIGHT': nextX += speed; break;
            }
            const currentTileX = Math.round(ghost.position.x);
            const currentTileY = Math.round(ghost.position.y);
            let collision = false;
            switch (ghost.direction) {
                case 'UP':
                    if (isWall(currentTileX, Math.floor(nextY), state.maze) && nextY < currentTileY) {
                        ghost.position.y = currentTileY;
                        collision = true;
                    }
                    break;
                case 'DOWN':
                    if (isWall(currentTileX, Math.ceil(nextY), state.maze) && nextY > currentTileY) {
                        ghost.position.y = currentTileY;
                        collision = true;
                    }
                    break;
                case 'LEFT':
                    if (isWall(Math.floor(nextX), currentTileY, state.maze) && nextX < currentTileX) {
                        ghost.position.x = currentTileX;
                        collision = true;
                    }
                    break;
                case 'RIGHT':
                    if (isWall(Math.ceil(nextX), currentTileY, state.maze) && nextX > currentTileX) {
                        ghost.position.x = currentTileX;
                        collision = true;
                    }
                    break;
            }
            if (!collision) {
                ghost.position.x = nextX;
                ghost.position.y = nextY;
            }
            // Handle tunnel wrapping for ghosts
            if (ghost.position.x < -0.5) ghost.position.x = state.maze[0].length - 0.51;
            if (ghost.position.x > state.maze[0].length - 0.5) ghost.position.x = -0.49;
        });
        // Move Projectiles & handle collisions
        state.projectiles = state.projectiles.filter((proj) => {
          const speed = PROJECTILE_SPEED * deltaSeconds;
          let hit = false;
          const prevX = proj.position.x;
          const prevY = proj.position.y;
          switch (proj.direction) {
            case 'UP': proj.position.y -= speed; break;
            case 'DOWN': proj.position.y += speed; break;
            case 'LEFT': proj.position.x -= speed; break;
            case 'RIGHT': proj.position.x += speed; break;
          }
          const gridX = Math.round(proj.position.x);
          const gridY = Math.round(proj.position.y);
          // Wall collision & ricochet
          if (isWall(proj.position.x, proj.position.y, state.maze)) {
            const wallOnX = isWall(proj.position.x, prevY, state.maze);
            const wallOnY = isWall(prevX, proj.position.y, state.maze);
            if (wallOnX && wallOnY) { // Corner hit
              proj.direction = oppositeDirection[proj.direction];
            } else if (wallOnX) { // Vertical wall
              if (proj.direction === 'LEFT') proj.direction = 'RIGHT';
              else if (proj.direction === 'RIGHT') proj.direction = 'LEFT';
            } else if (wallOnY) { // Horizontal wall
              if (proj.direction === 'UP') proj.direction = 'DOWN';
              else if (proj.direction === 'DOWN') proj.direction = 'UP';
            }
            // Reposition to avoid getting stuck
            proj.position = { x: prevX, y: prevY };
          }
          // Player collision
          for (const player of state.players) {
            if (player.id !== proj.playerId && Math.abs(player.position.x - proj.position.x) < 0.5 && Math.abs(player.position.y - proj.position.y) < 0.5) {
              if (state.gameMode === '1P' && player.id === 2) continue;
              player.isStunned = STUN_DURATION;
              hit = true;
              break;
            }
          }
          if (hit) return false;
          // Ghost collision
          for (const ghost of state.ghosts) {
            if (Math.abs(ghost.position.x - proj.position.x) < 0.5 && Math.abs(ghost.position.y - proj.position.y) < 0.5) {
              if (ghost.isVulnerable > 0 && !ghost.isEaten) {
                playSound('ghostEat');
                const shooter = state.players.find(p => p.id === proj.playerId);
                if (shooter) shooter.score += 200;
                ghost.isEaten = true;
                ghost.isVulnerable = 0;
                setTimeout(() => get().respawnGhost(ghost.id), 500);
              }
              hit = true;
              break;
            }
          }
          if (hit) return false;
          // Check projectile bounds
          if (gridX < -1 || gridX > state.maze[0].length || gridY < -1 || gridY > state.maze.length) {
            return false;
          }
          return true;
        });
        // Player / Pellet collision
        state.players.forEach((player, index) => {
            if (state.gameMode === '1P' && index === 1) return;
            const gridX = Math.round(player.position.x);
            const gridY = Math.round(player.position.y);
            const pelletIndex = state.pellets.findIndex(p => p.position.x === gridX && p.position.y === gridY);
            if (pelletIndex !== -1) {
                const pellet = state.pellets[pelletIndex];
                player.score += pellet.isPowerPellet ? 50 : 10;
                if (pellet.isPowerPellet) {
                    playSound('powerPellet');
                    state.ghosts.forEach(g => {
                      g.isVulnerable = VULNERABLE_DURATION;
                      g.isEaten = false;
                    });
                } else {
                    playSound('pellet');
                }
                state.pellets.splice(pelletIndex, 1);
            }
        });
        // Player / Ghost collision
        state.players.forEach((player, index) => {
            if (state.gameMode === '1P' && index === 1) return;
            if (player.isStunned > 0) return;
            state.ghosts.forEach(ghost => {
                if (!ghost.isEaten && Math.abs(player.position.x - ghost.position.x) < 0.7 && Math.abs(player.position.y - ghost.position.y) < 0.7) {
                    if (ghost.isVulnerable > 0) {
                        playSound('ghostEat');
                        player.score += 200;
                        ghost.isEaten = true;
                        ghost.isVulnerable = 0;
                        setTimeout(() => get().respawnGhost(ghost.id), 500);
                    } else {
                        playSound('death');
                        player.lives--;
                        player.position = player.id === 1 ? { ...INITIAL_PLAYER_1.position } : { ...INITIAL_PLAYER_2.position };
                        player.direction = 'STOP';
                        player.nextDirection = 'STOP';
                    }
                }
            });
        });
        // Check for game over
        const p1Lives = state.players[0].lives;
        const p2Lives = state.players[1].lives;
        const isGameOver = state.pellets.length === 0 || p1Lives <= 0 || (state.gameMode === '2P' && p2Lives <= 0);
        if (isGameOver) {
            state.status = 'GAME_OVER';
            const p1Score = state.players[0].score;
            const p2Score = state.players[1].score;
            if (state.gameMode === '1P') {
              state.winner = 1;
            } else {
              state.winner = p1Score > p2Score ? 1 : (p2Score > p1Score ? 2 : null);
            }
            const finalHighScore = Math.max(p1Score, p2Score, state.highScore);
            state.highScore = finalHighScore;
        }
      });
    },
  })),
);