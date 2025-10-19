import React, { useState } from 'react';
import { useGameStore } from '@/game/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(4px)' },
  exit: { opacity: 0, backdropFilter: 'blur(0px)' },
};
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
  exit: { opacity: 0, y: -20 },
};
const GameOverlay: React.FC = () => {
  const { status, winner, p1NameFromStore, p2NameFromStore, p1Score, p2Score, startGame, resetGame, setPlayerName, setGameMode } = useGameStore(
    useShallow((state) => ({
      status: state.status,
      winner: state.winner,
      p1NameFromStore: state.players[0].name,
      p2NameFromStore: state.players[1].name,
      p1Score: state.players[0].score,
      p2Score: state.players[1].score,
      startGame: state.startGame,
      resetGame: state.resetGame,
      setPlayerName: state.setPlayerName,
      setGameMode: state.setGameMode,
    }))
  );
  const [p1Name, setP1Name] = useState('PLAYER 1');
  const [p2Name, setP2Name] = useState('PLAYER 2');
  const isVisible = status === 'MODE_SELECTION' || status === 'GAME_OVER' || status === 'PAUSED';
  const handleStart = (mode: '1P' | '2P') => {
    setPlayerName(1, p1Name || 'PLAYER 1');
    setGameMode(mode);
    if (mode === '2P') {
      setPlayerName(2, p2Name || 'PLAYER 2');
    }
    startGame();
  };
  const renderContent = () => {
    switch (status) {
      case 'MODE_SELECTION':
        return (
          <>
            <h1 className="text-5xl md:text-7xl font-mono text-pac-yellow animate-glitch" style={{ textShadow: '3px 3px #FF00FF' }}>
              PIXEL VENGEANCE
            </h1>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-pac-yellow text-xl">PLAYER 1</label>
                <Input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  maxLength={10}
                  className="bg-black/50 border-2 border-pac-yellow text-pac-yellow text-center font-mono text-lg rounded-none focus:ring-pac-yellow"
                />
              </div>
              <div className="space-y-2">
                <label className="text-pac-cyan text-xl">PLAYER 2</label>
                <Input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  maxLength={10}
                  className="bg-black/50 border-2 border-pac-cyan text-pac-cyan text-center font-mono text-lg rounded-none focus:ring-pac-cyan"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mt-8">
              <Button onClick={() => handleStart('1P')} className="font-mono text-2xl bg-transparent border-2 border-pac-yellow text-pac-yellow hover:bg-pac-yellow hover:text-black rounded-none w-64">
                1 PLAYER START
              </Button>
              <Button onClick={() => handleStart('2P')} className="font-mono text-2xl bg-transparent border-2 border-pac-cyan text-pac-cyan hover:bg-pac-cyan hover:text-black rounded-none w-64">
                2 PLAYER START
              </Button>
            </div>
            <div className="mt-6">
                <Button asChild variant="link" className="font-mono text-lg text-white hover:text-pac-yellow rounded-none">
                    <Link to="/instructions">HOW TO PLAY</Link>
                </Button>
            </div>
          </>
        );
      case 'GAME_OVER':
        return (
          <>
            <h1 className="text-6xl font-mono text-red-500 animate-glitch">GAME OVER</h1>
            {winner !== null ? (
              <h2 className={`text-4xl mt-4 ${winner === 1 ? 'text-pac-yellow' : 'text-pac-cyan'}`}>
                {winner === 1 ? p1NameFromStore : p2NameFromStore} WINS!
              </h2>
            ) : (
              <h2 className="text-4xl mt-4 text-white">IT'S A DRAW!</h2>
            )}
            <div className="text-2xl text-white mt-8">
              <p>{p1NameFromStore} Score: {p1Score}</p>
              <p>{p2NameFromStore} Score: {p2Score}</p>
            </div>
            <Button onClick={resetGame} className="mt-8 font-mono text-2xl bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-none">
              PRESS 'R' TO RESTART
            </Button>
          </>
        );
      case 'PAUSED':
        return <h1 className="text-6xl font-mono text-pac-cyan animate-pulse">PAUSED</h1>;
      default:
        return null;
    }
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/60"
        >
          <motion.div variants={contentVariants} className="text-center p-8">
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default GameOverlay;