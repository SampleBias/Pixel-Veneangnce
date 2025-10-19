import { useEffect, useRef } from 'react';
import { useGameStore } from '@/game/store';
export const useGameLoop = () => {
  const update = useGameStore((state) => state.update);
  const status = useGameStore((state) => state.status);
  const animationFrameId = useRef<number>();
  const lastTime = useRef<number>(performance.now());
  useEffect(() => {
    const loop = (currentTime: number) => {
      if (status === 'PLAYING') {
        const delta = currentTime - lastTime.current;
        update(delta);
      }
      lastTime.current = currentTime;
      animationFrameId.current = requestAnimationFrame(loop);
    };
    // Reset lastTime when starting a new game to avoid a large delta jump
    lastTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [status, update]);
};