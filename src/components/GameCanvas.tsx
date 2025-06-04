
import React, { useEffect, useRef, useCallback } from 'react';
import { GameState } from '../types/game';

interface GameCanvasProps {
  gameState: GameState;
  playerId: string | null;
  onPaddleMove: (direction: 'up' | 'down') => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, playerId, onPaddleMove }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.key.toLowerCase());
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key.toLowerCase());
  }, []);

  // Process keyboard input and send paddle movements
  useEffect(() => {
    const processInput = () => {
      const keys = keysRef.current;
      
      // Player 1 controls (W/S)
      if (keys.has('w')) {
        onPaddleMove('up');
      }
      if (keys.has('s')) {
        onPaddleMove('down');
      }
      
      // Player 2 controls (Arrow keys)
      if (keys.has('arrowup')) {
        onPaddleMove('up');
      }
      if (keys.has('arrowdown')) {
        onPaddleMove('down');
      }
    };

    const inputInterval = setInterval(processInput, 16); // ~60fps

    return () => clearInterval(inputInterval);
  }, [onPaddleMove]);

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Render game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#475569'; // slate-600
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();

    // Draw paddles
    ctx.fillStyle = '#06b6d4'; // cyan-500
    const players = Object.values(gameState.players);
    
    players.forEach(player => {
      if (player.paddle) {
        ctx.fillRect(
          player.paddle.x,
          player.paddle.y,
          player.paddle.width,
          player.paddle.height
        );
      }
    });

    // Draw ball
    if (gameState.ball) {
      ctx.fillStyle = '#f59e0b'; // amber-500
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw scores
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    const playerArray = Object.values(gameState.players);
    if (playerArray.length >= 2) {
      // Player 1 score (left)
      ctx.fillText(
        playerArray.find(p => p.side === 'left')?.score.toString() || '0',
        CANVAS_WIDTH / 4,
        50
      );
      
      // Player 2 score (right)
      ctx.fillText(
        playerArray.find(p => p.side === 'right')?.score.toString() || '0',
        (CANVAS_WIDTH * 3) / 4,
        50
      );
    }
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-purple-500/20 rounded-lg bg-slate-900"
        tabIndex={0}
      />
      
      <div className="text-center text-sm text-slate-400">
        <p>Player 1: W (up) / S (down) | Player 2: ↑ (up) / ↓ (down)</p>
        <p>First to 5 points wins!</p>
      </div>
    </div>
  );
};
