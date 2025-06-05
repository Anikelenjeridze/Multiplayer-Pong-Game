
import { useEffect, useState, useCallback } from 'react';
import { GameState, Player } from '../types/game';

export const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 80;
  const PADDLE_SPEED = 5;
  const BALL_SPEED = 3;

  useEffect(() => {
    // Simulate socket connection
    const mockSocket = {
      id: 'player_' + Math.random().toString(36).substring(7),
      connected: true,
      emit: (event: string, data?: any) => {
        console.log('Emitting:', event, data);
      },
      on: (event: string, callback: Function) => {
        console.log('Listening for:', event);
      },
      off: (event: string, callback?: Function) => {
        console.log('Removing listener for:', event);
      },
      disconnect: () => {
        console.log('Disconnecting socket');
      }
    };

    setSocket(mockSocket);
    setConnected(true);
    setPlayerId(mockSocket.id);

    return () => {
      mockSocket.disconnect();
    };
  }, []);

  const joinRoom = useCallback(() => {
    if (socket) {
      setWaiting(true);
      
      // Simulate finding a match after 2 seconds
      setTimeout(() => {
        const newRoomId = 'room_' + Math.random().toString(36).substring(7);
        setRoomId(newRoomId);
        setWaiting(false);
        
        // Create initial game state with two players
        const player1: Player = {
          id: playerId!,
          paddle: {
            x: 20,
            y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
          },
          score: 0,
          side: 'left'
        };

        const player2: Player = {
          id: 'ai_player',
          paddle: {
            x: CANVAS_WIDTH - 30,
            y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT
          },
          score: 0,
          side: 'right'
        };

        const initialGameState: GameState = {
          players: {
            [player1.id]: player1,
            [player2.id]: player2
          },
          ball: {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: BALL_SPEED,
            dy: BALL_SPEED,
            radius: 8,
            speed: BALL_SPEED
          },
          gameStarted: true,
          gameEnded: false,
          roomId: newRoomId
        };

        setGameState(initialGameState);
        
        // Start game loop
        startGameLoop(initialGameState);
      }, 2000);
    }
  }, [socket, playerId]);

  const movePaddle = useCallback((direction: 'up' | 'down') => {
    if (!gameState || !playerId) return;

    setGameState(prevState => {
      if (!prevState) return prevState;

      const updatedPlayers = { ...prevState.players };
      const player = updatedPlayers[playerId];
      
      if (player) {
        const newY = direction === 'up' 
          ? Math.max(0, player.paddle.y - PADDLE_SPEED)
          : Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, player.paddle.y + PADDLE_SPEED);
        
        updatedPlayers[playerId] = {
          ...player,
          paddle: { ...player.paddle, y: newY }
        };
      }

      return { ...prevState, players: updatedPlayers };
    });
  }, [gameState, playerId]);

  const startGameLoop = useCallback((initialState: GameState) => {
    let currentState = initialState;
    
    const gameLoop = () => {
      if (currentState.gameEnded) return;

      // Update ball position
      const newBall = { ...currentState.ball };
      newBall.x += newBall.dx;
      newBall.y += newBall.dy;

      // Ball collision with top/bottom walls
      if (newBall.y <= newBall.radius || newBall.y >= CANVAS_HEIGHT - newBall.radius) {
        newBall.dy = -newBall.dy;
        newBall.y = Math.max(newBall.radius, Math.min(CANVAS_HEIGHT - newBall.radius, newBall.y));
      }

      // Ball collision with paddles
      const players = Object.values(currentState.players);
      const leftPlayer = players.find(p => p.side === 'left');
      const rightPlayer = players.find(p => p.side === 'right');

      if (leftPlayer && 
          newBall.x - newBall.radius <= leftPlayer.paddle.x + leftPlayer.paddle.width &&
          newBall.x - newBall.radius >= leftPlayer.paddle.x &&
          newBall.y >= leftPlayer.paddle.y &&
          newBall.y <= leftPlayer.paddle.y + leftPlayer.paddle.height) {
        newBall.dx = Math.abs(newBall.dx);
        newBall.x = leftPlayer.paddle.x + leftPlayer.paddle.width + newBall.radius;
      }

      if (rightPlayer &&
          newBall.x + newBall.radius >= rightPlayer.paddle.x &&
          newBall.x + newBall.radius <= rightPlayer.paddle.x + rightPlayer.paddle.width &&
          newBall.y >= rightPlayer.paddle.y &&
          newBall.y <= rightPlayer.paddle.y + rightPlayer.paddle.height) {
        newBall.dx = -Math.abs(newBall.dx);
        newBall.x = rightPlayer.paddle.x - newBall.radius;
      }

      // Simple AI for right paddle
      if (rightPlayer) {
        const paddleCenter = rightPlayer.paddle.y + rightPlayer.paddle.height / 2;
        const diff = newBall.y - paddleCenter;
        
        if (Math.abs(diff) > 10) {
          const newY = diff > 0 
            ? Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, rightPlayer.paddle.y + PADDLE_SPEED)
            : Math.max(0, rightPlayer.paddle.y - PADDLE_SPEED);
          
          currentState.players[rightPlayer.id] = {
            ...rightPlayer,
            paddle: { ...rightPlayer.paddle, y: newY }
          };
        }
      }

      // Score when ball goes off screen
      let scoreUpdated = false;
      if (newBall.x < 0) {
        // Right player scores
        if (rightPlayer) {
          currentState.players[rightPlayer.id].score++;
          scoreUpdated = true;
        }
      } else if (newBall.x > CANVAS_WIDTH) {
        // Left player scores
        if (leftPlayer) {
          currentState.players[leftPlayer.id].score++;
          scoreUpdated = true;
        }
      }

      if (scoreUpdated) {
        // Reset ball position
        newBall.x = CANVAS_WIDTH / 2;
        newBall.y = CANVAS_HEIGHT / 2;
        newBall.dx = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
        newBall.dy = (Math.random() - 0.5) * BALL_SPEED;

        // Check for game end
        const maxScore = Math.max(...Object.values(currentState.players).map(p => p.score));
        if (maxScore >= 5) {
          const winner = Object.values(currentState.players).find(p => p.score === maxScore);
          currentState.gameEnded = true;
          currentState.winner = winner?.side === 'left' ? 'Player 1' : 'Player 2';
        }
      }

      currentState = {
        ...currentState,
        ball: newBall
      };

      setGameState({ ...currentState });

      if (!currentState.gameEnded) {
        setTimeout(gameLoop, 16); // ~60 FPS
      }
    };

    gameLoop();
  }, []);

  return {
    socket,
    connected,
    gameState,
    playerId,
    roomId,
    waiting,
    joinRoom,
    movePaddle,
    setGameState
  };
};
