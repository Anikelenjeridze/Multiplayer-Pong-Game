
import React from 'react';
import { Users, Gamepad2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GameLobbyProps {
  onJoinRoom: () => void;
  waiting: boolean;
  connected: boolean;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ onJoinRoom, waiting, connected }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 border-purple-500/20 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center">
            <Gamepad2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Multiplayer Pong
          </CardTitle>
          <CardDescription className="text-slate-300">
            Classic arcade action with real-time multiplayer
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <Users className="h-5 w-5 mx-auto mb-1 text-cyan-400" />
              <div className="text-slate-300">2 Players</div>
            </div>
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <Zap className="h-5 w-5 mx-auto mb-1 text-purple-400" />
              <div className="text-slate-300">Real-time</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-slate-300">
                {connected ? 'Connected to server' : 'Connecting...'}
              </span>
            </div>

            {waiting && (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-slate-400">Waiting for opponent...</p>
              </div>
            )}
          </div>

          <Button 
            onClick={onJoinRoom}
            disabled={!connected || waiting}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3"
          >
            {waiting ? 'Finding Match...' : 'Start Game'}
          </Button>

          <div className="text-xs text-slate-400 text-center">
            <p>Game Rules: First to 5 points wins!</p>
            <p className="mt-1">Use keyboard controls to move your paddle</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
