# 🏓 Real-Time Multiplayer Pong Battle

A modern take on the classic Pong game featuring real-time multiplayer functionality. Built with React, TypeScript, and Socket.IO for smooth, responsive gameplay.

Experience the game live: [Play Multiplayer Pong](https://lovable.dev/projects/ee6adb19-c5b5-4bd7-aedd-6fdb9f597882)

## ✨ Features

- **Real-time multiplayer gameplay** - Battle against friends in real-time
- **Responsive design** - Works seamlessly on desktop and mobile devices
- **Smooth animations** - 60 FPS gameplay with HTML5 Canvas rendering
- **Modern UI** - Beautiful gradient design with Tailwind CSS
- **Room-based matchmaking** - Automatic player pairing system
- **Score tracking** - First to 5 points wins
- **Keyboard controls** - Intuitive WASD and arrow key controls
- **AI opponent** - Practice against computer players
- **Connection status** - Real-time connection monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <YOUR_GIT_URL>
   cd real-time-pong-battle
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

   The server will start on `http://localhost:3001`

5. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The game will be available at `http://localhost:5173`

## 🎯 How to Play

1. **Join a Game**: Click "Start Game" on the main screen
2. **Wait for Opponent**: The system will automatically match you with another player
3. **Control Your Paddle**:
   - **Player 1**: Use `W` and `S` keys
   - **Player 2**: Use `↑` and `↓` arrow keys
4. **Score Points**: Hit the ball past your opponent's paddle
5. **Win the Game**: First player to reach 5 points wins!

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Socket.IO Client** - Real-time communication

### Backend

- **Node.js** - Server runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket communication
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
real-time-pong-battle/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── GameCanvas.tsx       # Main game rendering
│   │   ├── GameHUD.tsx          # Score and game info
│   │   ├── GameLobby.tsx        # Landing page
│   │   └── ui/                  # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   │   └── useSocket.ts         # Socket connection logic
│   ├── pages/                   # Page components
│   │   └── Index.tsx            # Main game page
│   ├── types/                   # TypeScript definitions
│   │   └── game.ts              # Game-related types
│   └── lib/                     # Utility functions
├── server/                      # Backend source code
│   ├── src/
│   │   └── server.js           # Express + Socket.IO server
│   └── package.json            # Server dependencies
├── public/                     # Static assets
└── package.json               # Frontend dependencies
```

## 🔧 Development

### Running in Development Mode

1. **Backend** (Terminal 1):

   ```bash
   cd server
   npm run dev
   ```

2. **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SOCKET_URL=http://localhost:3001
```

For the server, you can set:

```env
PORT=3001
```

## 🌐 Deployment

This project is ready for deployment on various platforms:

### Frontend Deployment

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **GitHub Pages**: Use the built-in GitHub Actions workflow

### Backend Deployment

- **Heroku**: Deploy the `server` folder as a Node.js app
- **Railway**: Connect your GitHub repo and deploy
- **DigitalOcean**: Use App Platform for easy deployment

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Maintain the existing code style
- Update documentation when needed

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Kill process using port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or use a different port
set PORT=3002 && npm run dev
```

**Frontend can't connect to backend**

- Ensure both servers are running
- Check that the backend is on port 3001
- Verify CORS settings in server configuration

**Game not loading**

- Clear browser cache
- Check browser console for errors
- Ensure all dependencies are installed
