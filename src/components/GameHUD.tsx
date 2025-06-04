
import React from 'react';
import { Trophy, Clock, Users } from 'lucide-react';
import { GameState } from '../types/game';

interface GameHUDProps {
  gameState: GameState | null;
  playerId: string | null;
  roomId: string | null;
}

export const GameHUD: React.FC<GameHUDProps> = ({ gameState, playerId, roomId }) => {
  if (!gameState) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="bg-slate-800/90 backdrop-blur rounded-lg border border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Room: {roomId?.substring(0, 8)}</span>
            </div>
            
            {gameState.gameStarted && !gameState.gameEnded && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Live Game</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">Player 1</div>
              <div className="text-sm text-slate-400">W/S to move</div>
            </div>
            
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy className="h-5 w-5" />
              <span className="text-lg font-bold">First to 5</span>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">Player 2</div>
              <div className="text-sm text-slate-400">↑/↓ to move</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
