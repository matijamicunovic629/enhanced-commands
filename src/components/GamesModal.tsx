import React, { useState } from 'react';
import { 
  X, Maximize2, Minimize2, Brain, Trophy, Gift, 
  Swords, Target, Star, BarChart2, Users, Award,
  Gamepad2, Clock, Coins, ArrowLeft, Lock, BarChart,
  Pickaxe
} from 'lucide-react';
import { CryptoTrivia } from './games/CryptoTrivia';
import { MemeArena } from './games/MemeArena';
import { GameStats } from './games/GameStats';
import { TokenTycoon } from './games/TokenTycoon';
import { MiningMayhem } from './games/MiningMayhem';
import { useStore } from '../store/useStore';

interface GamesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component?: React.FC;
  comingSoon?: boolean;
}

const games: Game[] = [
  {
    id: 'crypto-trivia',
    name: 'Crypto Trivia',
    description: 'Test your crypto knowledge and earn tokens',
    icon: <Brain className="w-6 h-6" />,
    component: CryptoTrivia
  },
  {
    id: 'meme-arena',
    name: 'Meme Arena',
    description: 'Battle with legendary meme characters',
    icon: <Swords className="w-6 h-6" />,
    component: MemeArena
  },
  {
    id: 'token-tycoon',
    name: 'Token Tycoon',
    description: 'Build your DeFi empire from scratch',
    icon: <Coins className="w-6 h-6" />,
    component: TokenTycoon
  },
  {
    id: 'mining-mayhem',
    name: 'Mining Mayhem',
    description: 'Mine tokens while defending against bandits',
    icon: <Pickaxe className="w-6 h-6" />,
    component: MiningMayhem
  },
  {
    id: 'trading-simulator',
    name: 'Trading Simulator',
    description: 'Practice trading with virtual assets',
    icon: <BarChart2 className="w-6 h-6" />,
    comingSoon: true
  },
  {
    id: 'prediction-game',
    name: 'Price Prediction',
    description: 'Predict price movements and win rewards',
    icon: <Target className="w-6 h-6" />,
    comingSoon: true
  }
];

export const GamesModal: React.FC<GamesModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [showStats, setShowStats] = useState(false);
  const { gameStats } = useStore();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-[90%] h-[90%] rounded-xl'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            {activeGame && (
              <button
                onClick={() => {
                  setActiveGame(null);
                  setShowStats(false);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-xl font-semibold">Games</h2>
            <button
              onClick={() => {
                setShowStats(!showStats);
                setActiveGame(null);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <BarChart className="w-4 h-4" />
              <span>Statistics</span>
              <div className="flex items-center gap-1 text-sm text-yellow-400 ml-2">
                <Coins className="w-3.5 h-3.5" />
                <span>{gameStats.totalTokens}</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-73px)]">
          {showStats ? (
            <GameStats />
          ) : activeGame?.component ? (
            <activeGame.component />
          ) : (
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => !game.comingSoon && setActiveGame(game)}
                    disabled={game.comingSoon}
                    className={`flex flex-col items-center gap-4 p-6 rounded-xl transition-all ${
                      game.comingSoon
                        ? 'bg-white/5 cursor-not-allowed'
                        : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02]'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                      {game.icon}
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="text-lg font-medium">{game.name}</h3>
                        {game.comingSoon && (
                          <Lock className="w-4 h-4 text-white/40" />
                        )}
                      </div>
                      <p className="text-sm text-white/60 mt-1">{game.description}</p>
                      {game.comingSoon && (
                        <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium mt-2">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};