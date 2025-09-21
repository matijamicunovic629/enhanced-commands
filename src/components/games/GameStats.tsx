import React, { useState, useEffect } from 'react';
import { Trophy, Swords, Brain, Coins, ArrowRight, Check, Pickaxe, Gift, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const GameStats: React.FC = () => {
  const [claimingTokens, setClaimingTokens] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const { gameStats, updateGameStats } = useStore();
  
  // Check if tokens can be claimed (at least 100 tokens)
  const canClaim = gameStats.totalTokens >= 100;

  // Reset claim success message after 3 seconds
  useEffect(() => {
    if (showClaimSuccess) {
      const timer = setTimeout(() => {
        setShowClaimSuccess(false);
        setClaimedAmount(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showClaimSuccess]);

  const handleClaimTokens = () => {
    if (!canClaim) return;
    
    setClaimingTokens(true);
    
    // Simulate token claiming process
    setTimeout(() => {
      const amountToClaim = gameStats.totalTokens;
      setClaimedAmount(amountToClaim);
      
      // Update game stats
      updateGameStats({
        totalTokens: 0, // Reset tokens after claiming
        triviaStats: {
          ...gameStats.triviaStats,
          tokensEarned: 0
        },
        arenaStats: {
          ...gameStats.arenaStats,
          tokensEarned: 0
        }
      });
      
      setClaimingTokens(false);
      setShowClaimSuccess(true);
    }, 1500);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Claim Success Message */}
      {showClaimSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-green-400/30 animate-fade-in">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Tokens Claimed!</h3>
            <p className="text-white/90 mb-4">
              You've successfully claimed {claimedAmount} tokens to your wallet.
            </p>
            <button
              onClick={() => setShowClaimSuccess(false)}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Total Tokens */}
      <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl p-6 mb-6 border border-amber-500/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">Total Tokens</h3>
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="text-3xl font-bold">{gameStats.totalTokens}</span>
            </div>
            {!canClaim && gameStats.totalTokens > 0 && (
              <p className="text-sm text-white/60 mt-2">
                Earn {Math.max(0, 100 - gameStats.totalTokens)} more tokens to claim rewards
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleClaimTokens}
              disabled={!canClaim || claimingTokens}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                canClaim && !claimingTokens
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/20 transform hover:scale-105'
                  : 'bg-white/10 cursor-not-allowed opacity-70'
              }`}
            >
              {claimingTokens ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Claiming...</span>
                </>
              ) : (
                <>
                  <span>Claim Tokens</span>
                  {canClaim && <ArrowRight className="w-5 h-5" />}
                </>
              )}
            </button>
            <p className="text-xs text-white/60">
              Claim tokens to your wallet
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Trivia Stats */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Crypto Trivia</h3>
              <p className="text-white/60">Knowledge Challenge</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Games Played</span>
              <span className="font-medium">{gameStats.triviaStats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tokens Earned</span>
              <span className="font-medium text-yellow-400">{gameStats.triviaStats.tokensEarned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">High Score</span>
              <span className="font-medium">{gameStats.triviaStats.highScore}/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Accuracy</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${gameStats.triviaStats.accuracy}%` }}
                  />
                </div>
                <span>{gameStats.triviaStats.accuracy}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Best Streak</span>
              <span className="font-medium">{gameStats.triviaStats.bestStreak}</span>
            </div>
          </div>
        </div>

        {/* Arena Stats */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Swords className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Meme Arena</h3>
              <p className="text-white/60">Battle Stats</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Battles Played</span>
              <span className="font-medium">{gameStats.arenaStats.battlesPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tokens Earned</span>
              <span className="font-medium text-yellow-400">{gameStats.arenaStats.tokensEarned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Wins</span>
              <span className="font-medium">{gameStats.arenaStats.wins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Win Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500"
                    style={{ width: `${gameStats.arenaStats.winRate}%` }}
                  />
                </div>
                <span>{gameStats.arenaStats.winRate}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Best Streak</span>
              <span className="font-medium">{gameStats.arenaStats.bestStreak}</span>
            </div>
          </div>
        </div>

        {/* Mining Mayhem Stats */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Pickaxe className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Mining Mayhem</h3>
              <p className="text-white/60">Mining Stats</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Games Played</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tokens Earned</span>
              <span className="font-medium text-yellow-400">1250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Highest Level</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Bandits Defeated</span>
              <span className="font-medium">87</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Nodes Mined</span>
              <span className="font-medium">156</span>
            </div>
          </div>
        </div>

        {/* Token Tycoon Stats */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg hover:bg-white/10 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Token Tycoon</h3>
              <p className="text-white/60">Empire Stats</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Games Played</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Tokens Earned</span>
              <span className="font-medium text-yellow-400">850</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Highest TVL</span>
              <span className="font-medium">$2.4M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Prestige Level</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">DEXes Created</span>
              <span className="font-medium">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-lg mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Achievements</h3>
            <p className="text-white/60">Your Gaming Milestones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium">Trivia Master</div>
                <div className="text-sm text-white/60">Score 10/10 in Trivia</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${(gameStats.triviaStats.highScore / 10) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-right text-white/60">
              {gameStats.triviaStats.highScore}/10
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <Swords className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-medium">Arena Champion</div>
                <div className="text-sm text-white/60">Win 10 battles</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all"
                style={{ width: `${(gameStats.arenaStats.wins / 10) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-right text-white/60">
              {gameStats.arenaStats.wins}/10
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <Pickaxe className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-medium">Mining Expert</div>
                <div className="text-sm text-white/60">Reach level 15 in Mining Mayhem</div>
              </div>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${(12 / 15) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-right text-white/60">
              12/15
            </div>
          </div>
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Gift className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Rewards Program</h3>
            <p className="text-white/60">Earn special rewards by playing games</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-xl p-4 border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="font-medium">Token Multiplier</h4>
              </div>
              <p className="text-sm text-white/60 mb-3">
                Earn 2x tokens in all games for 24 hours
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Cost: 5,000 tokens</span>
                </div>
                <button className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-sm font-medium">
                  Activate
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-cyan-600/30 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-5 h-5 text-blue-400" />
                <h4 className="font-medium">Exclusive Badge</h4>
              </div>
              <p className="text-sm text-white/60 mb-3">
                Unlock a rare profile badge to show off your gaming skills
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Cost: 10,000 tokens</span>
                </div>
                <button className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-sm font-medium">
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};