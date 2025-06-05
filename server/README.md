# Multiplayer Pong Server

## Setup Instructions

1. **Install dependencies:**

   ```bash
   cd server
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

The server will run on port 3001.

## Frontend Setup

The frontend should automatically connect to the backend when both are running.

## How to Play

1. Start the backend server
2. Open the frontend in your browser
3. Click "Start Game"
4. Open another browser tab/window to join as a second player
5. Use keyboard controls:
   - Player 1: W (up) / S (down)
   - Player 2: Arrow Up / Arrow Down

First player to 5 points wins!

## Troubleshooting

If port 3001 is in use, you can change it by setting the PORT environment variable:

```bash
set PORT=3002 && npm run dev
```
