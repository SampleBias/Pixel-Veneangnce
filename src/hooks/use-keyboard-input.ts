import { useEffect } from 'react';
import { useGameStore } from '@/game/store';
import { useShallow } from 'zustand/react/shallow';
export const useKeyboardInput = () => {
  const { setDirection, shoot, resetGame, status, gameMode, pauseGame, startGame } = useGameStore(
    useShallow((state) => ({
      setDirection: state.setDirection,
      shoot: state.shoot,
      resetGame: state.resetGame,
      status: state.status,
      gameMode: state.gameMode,
      pauseGame: state.pauseGame,
      startGame: state.startGame,
    }))
  );
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'GAME_OVER' && e.key.toLowerCase() === 'r') {
        resetGame();
        return;
      }
      if (e.key.toLowerCase() === 'p') {
        if (status === 'PLAYING') {
          pauseGame();
        } else if (status === 'PAUSED') {
          startGame();
        }
        return;
      }
      if (status !== 'PLAYING') return;
      // Player 1 Controls (WASD + Space)
      switch (e.key.toLowerCase()) {
        case 'w':
          setDirection(1, 'UP');
          break;
        case 's':
          setDirection(1, 'DOWN');
          break;
        case 'a':
          setDirection(1, 'LEFT');
          break;
        case 'd':
          setDirection(1, 'RIGHT');
          break;
        case ' ':
          e.preventDefault();
          shoot(1);
          break;
      }
      // Player 2 Controls (Arrow Keys + Enter)
      if (gameMode === '2P') {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            setDirection(2, 'UP');
            break;
          case 'ArrowDown':
            e.preventDefault();
            setDirection(2, 'DOWN');
            break;
          case 'ArrowLeft':
            e.preventDefault();
            setDirection(2, 'LEFT');
            break;
          case 'ArrowRight':
            e.preventDefault();
            setDirection(2, 'RIGHT');
            break;
          case 'Enter':
            e.preventDefault();
            shoot(2);
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, gameMode, resetGame, setDirection, shoot, pauseGame, startGame]);
};