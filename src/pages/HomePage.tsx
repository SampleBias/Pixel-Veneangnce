import React from 'react';
import GameCanvas from '@/components/GameCanvas';
import GameUI from '@/components/GameUI';
import GameOverlay from '@/components/GameOverlay';
import { useKeyboardInput } from '@/hooks/use-keyboard-input';
import { useGameLoop } from '@/hooks/use-game-loop';
export function HomePage() {
  useKeyboardInput();
  useGameLoop();
  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-mono">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center">
        <GameUI />
        <div className="relative shadow-2xl shadow-cyan-500/20">
          <GameCanvas />
          <GameOverlay />
        </div>
        <footer className="text-center text-gray-500 text-xs mt-8">
          <p>Built with ❤️ by hc-bld-dev on Cloudflare</p>
        </footer>
      </div>
    </div>
  );
}