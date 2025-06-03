
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 5;
const BALL_SPEED = 3;

// Room management
const rooms = new Map();
const waitingPlayers = [];






// Game state
function createGameState(roomId, player1Id, player2Id) {
  return {
    players: {
      [player1Id]: {
        id: player1Id,
           paddle: {
          x: 20,
          y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT
        },
        score: 0,
        side: 'left'
      },
      [player2Id]: {
        id: player2Id,
        paddle: {
          x: CANVAS_WIDTH - 30,
          y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT
        },
        score: 0,
        side: 'right'
      }
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
    roomId: roomId
  };
}




// Socket connection handling
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('join-room', () => {
    console.log('Player requesting to join room:', socket.id);
    
    if (waitingPlayers.length > 0) {
      // Match with waiting player
      const player1 = waitingPlayers.shift();
      const player2 = socket.id;
      const roomId = `room_${Date.now()}`;
      
      // Create room
         socket.join(roomId);
      io.sockets.sockets.get(player1)?.join(roomId);
      
      // Create game state
      const gameState = createGameState(roomId, player1, player2);
      rooms.set(roomId, gameState);
      
      // Notify both players
      io.to(roomId).emit('game-start', { gameState, roomId });
      
      console.log(`Game started in room ${roomId} with players ${player1} and ${player2}`);
      
      // Start game loop for this room
      startGameLoop(roomId);
    } else {
      // Add to waiting list
      waitingPlayers.push(socket.id);
      socket.emit('waiting');
      console.log('Player added to waiting list:', socket.id);
    }
  });





  socket.on('paddle-move', ({ direction }) => {
    // Find the room this player is in
    const roomId = Array.from(socket.rooms).find(room => room.startsWith('room_'));
       if (!roomId) return;
    
    const gameState = rooms.get(roomId);
    if (!gameState || gameState.gameEnded) return;
    
    const player = gameState.players[socket.id];
    if (!player) return;
    
    // Update paddle position
    const newY = direction === 'up' 
      ? Math.max(0, player.paddle.y - PADDLE_SPEED)
      : Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, player.paddle.y + PADDLE_SPEED);
    
    player.paddle.y = newY;
    
    // Broadcast updated game state
    io.to(roomId).emit('game-update', gameState);
  });



  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    // Remove from waiting list
    const waitingIndex = waitingPlayers.indexOf(socket.id);
    if (waitingIndex > -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }
    
    // Handle room cleanup
    rooms.forEach((gameState, roomId) => {
      if (gameState.players[socket.id]) {
        // Notify other player
        socket.to(roomId).emit('player-disconnected');
        rooms.delete(roomId);
      }
    });
  });
});





function startGameLoop(roomId) {
  const gameState = rooms.get(roomId);
  if (!gameState) return;
  
  const gameLoop = () => {
    if (gameState.gameEnded || !rooms.has(roomId)) return;
    
    // Update ball position
    gameState.ball.x += gameState.ball.dx;
    gameState.ball.y += gameState.ball.dy;
    
    // Ball collision with top/bottom walls
    if (gameState.ball.y <= gameState.ball.radius || 
        gameState.ball.y >= CANVAS_HEIGHT - gameState.ball.radius) {
      gameState.ball.dy = -gameState.ball.dy;
      gameState.ball.y = Math.max(gameState.ball.radius, 
        Math.min(CANVAS_HEIGHT - gameState.ball.radius, gameState.ball.y));
    }
    
    // Ball collision with paddles
    const players = Object.values(gameState.players);
    const leftPlayer = players.find(p => p.side === 'left');
    const rightPlayer = players.find(p => p.side === 'right');
   
    


    // Left paddle collision
    if (leftPlayer && 
        gameState.ball.x - gameState.ball.radius <= leftPlayer.paddle.x + leftPlayer.paddle.width &&
        gameState.ball.x - gameState.ball.radius >= leftPlayer.paddle.x &&
        gameState.ball.y >= leftPlayer.paddle.y &&
        gameState.ball.y <= leftPlayer.paddle.y + leftPlayer.paddle.height) {
      gameState.ball.dx = Math.abs(gameState.ball.dx);
      gameState.ball.x = leftPlayer.paddle.x + leftPlayer.paddle.width + gameState.ball.radius;
    }
    
    // Right paddle collision
    if (rightPlayer &&
        gameState.ball.x + gameState.ball.radius >= rightPlayer.paddle.x &&
        gameState.ball.x + gameState.ball.radius <= rightPlayer.paddle.x + rightPlayer.paddle.width &&
        gameState.ball.y >= rightPlayer.paddle.y &&
        gameState.ball.y <= rightPlayer.paddle.y + rightPlayer.paddle.height) {
      gameState.ball.dx = -Math.abs(gameState.ball.dx);
      gameState.ball.x = rightPlayer.paddle.x - gameState.ball.radius;
    }
    




    // Score when ball goes off screen
    let scoreUpdated = false;
    if (gameState.ball.x < 0) {
      rightPlayer.score++;
      scoreUpdated = true;
    } else if (gameState.ball.x > CANVAS_WIDTH) {
      leftPlayer.score++;
      scoreUpdated = true;
    }
    
    if (scoreUpdated) {
      // Reset ball
      gameState.ball.x = CANVAS_WIDTH / 2;
      gameState.ball.y = CANVAS_HEIGHT / 2;
      gameState.ball.dx = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
      gameState.ball.dy = (Math.random() - 0.5) * BALL_SPEED;
      
      // Check for game end
      const maxScore = Math.max(leftPlayer.score, rightPlayer.score);
      if (maxScore >= 5) {
        gameState.gameEnded = true;
        gameState.winner = leftPlayer.score > rightPlayer.score ? 'Player 1' : 'Player 2';
        io.to(roomId).emit('game-end', gameState);
        rooms.delete(roomId);
        return;
      }
    }
    


    
    // Broadcast game state
    io.to(roomId).emit('game-update', gameState);
    
    // Continue game loop
    setTimeout(gameLoop, 16); // ~60 FPS
  };
  
  gameLoop();
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Pong server running on port ${PORT}`);
});
