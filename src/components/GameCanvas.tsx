import React, { useRef, useEffect } from 'react';
import { useGameStore } from '@/game/store';
import { TILE_SIZE } from '@/game/constants';
import { GameState, Player, Ghost, Projectile, Pellet } from '@/game/types';

const drawMaze = (ctx: CanvasRenderingContext2D, maze: number[][]) => {
  ctx.strokeStyle = '#0000FF'; // maze-blue
  ctx.lineWidth = 2;
  ctx.beginPath();
  maze.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === 1) {
        ctx.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    });
  });
  ctx.stroke();
};
const drawPellets = (ctx: CanvasRenderingContext2D, pellets: Pellet[]) => {
  ctx.fillStyle = '#FFFFFF';
  pellets.forEach((pellet) => {
    ctx.beginPath();
    const radius = pellet.isPowerPellet ? 6 : 2;
    ctx.arc(
      pellet.position.x * TILE_SIZE + TILE_SIZE / 2,
      pellet.position.y * TILE_SIZE + TILE_SIZE / 2,
      radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  });
};
const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
  const x = player.position.x * TILE_SIZE + TILE_SIZE / 2;
  const y = player.position.y * TILE_SIZE + TILE_SIZE / 2;
  ctx.save();
  ctx.translate(x, y);
  let angle = 0;
  switch (player.direction) {
    case 'RIGHT': angle = 0; break;
    case 'DOWN': angle = 0.5 * Math.PI; break;
    case 'LEFT': angle = Math.PI; break;
    case 'UP': angle = 1.5 * Math.PI; break;
  }
  ctx.rotate(angle);
  const mouthAngle = 0.2 * Math.PI * (1 + Math.sin(Date.now() / 100));
  ctx.beginPath();
  ctx.arc(0, 0, TILE_SIZE / 2 - 2, mouthAngle, 2 * Math.PI - mouthAngle);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fillStyle = player.isStunned > 0 ? 'gray' : player.color;
  ctx.fill();
  ctx.restore();
};
const drawGhost = (ctx: CanvasRenderingContext2D, ghost: Ghost) => {
  const x = ghost.position.x * TILE_SIZE + TILE_SIZE / 2;
  const y = ghost.position.y * TILE_SIZE + TILE_SIZE / 2;
  const radius = TILE_SIZE / 2 - 2;
  ctx.fillStyle = ghost.isVulnerable > 0 ? (ghost.isEaten ? '#FFFFFF' : '#0000FF') : ghost.color;
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI, 0);
  ctx.lineTo(x + radius, y + radius);
  const wave = Math.sin(Date.now() / 100 + ghost.id.charCodeAt(0));
  for (let i = 0; i < 5; i++) {
    const offsetX = (i / 4) * (radius * 2) - radius;
    const offsetY = (i % 2 === 0 ? wave : -wave) * 3;
    ctx.lineTo(x + radius - (i * radius / 2), y + radius + offsetY);
  }
  ctx.lineTo(x - radius, y + radius);
  ctx.closePath();
  ctx.fill();
  // Eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x - radius / 2.5, y - radius / 3, 3, 0, 2 * Math.PI);
  ctx.arc(x + radius / 2.5, y - radius / 3, 3, 0, 2 * Math.PI);
  ctx.fill();
};
const drawProjectiles = (ctx: CanvasRenderingContext2D, projectiles: Projectile[]) => {
  projectiles.forEach((p) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(
      p.position.x * TILE_SIZE + TILE_SIZE / 2 - 2,
      p.position.y * TILE_SIZE + TILE_SIZE / 2 - 2,
      4,
      4
    );
  });
};
const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maze = useGameStore((state) => state.maze);
  const players = useGameStore((state) => state.players);
  const ghosts = useGameStore((state) => state.ghosts);
  const projectiles = useGameStore((state) => state.projectiles);
  const pellets = useGameStore((state) => state.pellets);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMaze(ctx, maze);
    drawPellets(ctx, pellets);
    players.forEach((player) => drawPlayer(ctx, player));
    ghosts.forEach((ghost) => drawGhost(ctx, ghost));
    drawProjectiles(ctx, projectiles);
  }, [maze, players, ghosts, projectiles, pellets]);
  const canvasWidth = maze[0].length * TILE_SIZE;
  const canvasHeight = maze.length * TILE_SIZE;
  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="bg-black border-2 border-maze-blue" />;
};
export default GameCanvas;