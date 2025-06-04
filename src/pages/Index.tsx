
import React from 'react';
import { useSocket } from '../hooks/useSocket';
import { GameLobby } from '../components/GameLobby';
import { GameCanvas } from '../components/GameCanvas';
import { GameHUD } from '../components/GameHUD';

const Index = () => {
  const { 
    connected, 
    gameState, 
    playerId, 
    roomId, 
    waiting, 
    joinRoom, 
    movePaddle 
  } = useSocket();

  // Show lobby if no game state or game hasn't started
  if (!gameState || !gameState.gameStarted) {
    return (
      <GameLobby 
        onJoinRoom={joinRoom}
        waiting={waiting}
        connected={connected}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Multiplayer Pong
          </h1>
          <p className="text-slate-300">Real-time multiplayer arcade action</p>
        </div>

        <GameHUD 
          gameState={gameState}
          playerId={playerId}
          roomId={roomId}
        />

        <div className="flex justify-center">
          <GameCanvas 
            gameState={gameState}
            playerId={playerId}
            onPaddleMove={movePaddle}
          />
        </div>

        {gameState.gameEnded && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center">
            <div className="bg-slate-800 p-8 rounded-lg border border-purple-500/20 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-xl text-purple-400 mb-6">
                {gameState.winner} Wins!
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
