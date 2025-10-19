import React from 'react';
import { useGameStore } from '@/game/store';
import { useShallow } from 'zustand/react/shallow';
import { Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
const PlayerStatus: React.FC<{ playerId: 1 | 2 }> = ({ playerId }) => {
  const { name, score, lives, ammo, playerExists } = useGameStore(
    useShallow((state) => {
      const player = state.players[playerId - 1];
      return {
        name: player?.name ?? `PLAYER ${playerId}`,
        score: player?.score ?? 0,
        lives: player?.lives ?? 0,
        ammo: player?.ammo ?? 0,
        playerExists: !!player,
      };
    })
  );
  if (!playerExists) return null;
  const playerColorClass = playerId === 1 ? 'text-pac-yellow' : 'text-pac-cyan';
  return (
    <div className="text-lg md:text-2xl font-mono">
      <h2 className={cn(playerColorClass, 'truncate max-w-[150px] md:max-w-xs')}>
        {name}
      </h2>
      <p className="text-white">{score.toString().padStart(6, '0')}</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: lives }).map((_, i) => (
            <Heart key={i} className={cn('w-5 h-5', playerColorClass)} fill="currentColor" />
          ))}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: ammo }).map((_, i) => (
            <Zap key={i} className="w-5 h-5 text-white" fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
  );
};
const GameUI: React.FC = () => {
  const highScore = useGameStore((state) => state.highScore);
  const gameMode = useGameStore((state) => state.gameMode);
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-start py-4">
        <PlayerStatus playerId={1} />
        <div className="text-center text-lg md:text-2xl font-mono">
          <h2 className="text-red-500">HIGH SCORE</h2>
          <p className="text-white">{highScore.toString().padStart(6, '0')}</p>
        </div>
        {gameMode === '2P' && <PlayerStatus playerId={2} />}
      </div>
    </div>
  );
};
export default GameUI;