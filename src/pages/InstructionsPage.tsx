import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
export function InstructionsPage() {
  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-mono text-white">
      <div className="w-full max-w-4xl mx-auto bg-black/50 border-2 border-maze-blue p-8 shadow-2xl shadow-cyan-500/20 space-y-8">
        <h1 className="text-4xl md:text-6xl font-mono text-pac-yellow text-center animate-glitch" style={{ textShadow: '3px 3px #FF00FF' }}>
          HOW TO PLAY
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
          <div className="space-y-4">
            <h2 className="text-2xl text-pac-yellow">Player 1</h2>
            <p><span className="font-bold text-white">Move:</span> WASD Keys</p>
            <p><span className="font-bold text-white">Shoot:</span> Spacebar</p>
          </div>
          <div className="space-y-4 md:text-right">
            <h2 className="text-2xl text-pac-cyan">Player 2</h2>
            <p><span className="font-bold text-white">Move:</span> Arrow Keys</p>
            <p><span className="font-bold text-white">Shoot:</span> Enter Key</p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl text-ghost-red text-center">OBJECTIVE</h2>
          <p className="text-center">Clear all the pellets in the maze or outscore your opponent! The game ends when all pellets are gone or one player runs out of lives.</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl text-ghost-pink text-center">COMBAT</h2>
          <ul className="list-disc list-inside space-y-2 text-left max-w-2xl mx-auto">
            <li>Shoot your opponent to stun them for a few seconds.</li>
            <li>Projectiles can <span className="text-pac-cyan">ricochet</span> off corners! Use this to your advantage.</li>
            <li>Ammo is limited but recharges over time. Watch your ammo count!</li>
            <li>Collect <span className="text-pac-yellow">Power Pellets</span> to make ghosts vulnerable.</li>
            <li>Shooting or eating a vulnerable ghost earns you big points.</li>
          </ul>
        </div>
        <div className="text-center pt-8">
          <Button asChild className="font-mono text-xl bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-none transition-all duration-200">
            <Link to="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              BACK TO GAME
            </Link>
          </Button>
        </div>
      </div>
       <footer className="text-center text-gray-500 text-xs mt-8">
          <p>Built with ❤️ by hc-bld-dev on Cloudflare</p>
        </footer>
    </div>
  );
}