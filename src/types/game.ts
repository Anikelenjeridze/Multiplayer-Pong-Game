
export interface Player {
  id: string;
  paddle: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  score: number;
  side: 'left' | 'right';
}

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  speed: number;
}

export interface GameState {
  players: { [key: string]: Player };
  ball: Ball;
  gameStarted: boolean;
  gameEnded: boolean;
  winner?: string;
  roomId: string;
}

export interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  paddleWidth: number;
  paddleHeight: number;
  ballRadius: number;
  ballSpeed: number;
  paddleSpeed: number;
  maxScore: number;
}
