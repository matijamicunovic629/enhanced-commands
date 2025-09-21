import React, { useState, useEffect } from 'react';
import { Swords, Shield, Zap, X, Info, Sparkles, Flame, Star, Gift, Heart } from 'lucide-react';
import { GameState, Action, PowerUp } from '../../types/memeArena';

interface BattleArenaProps {
  state: GameState;
  onAction: (action: Action) => void;
  onNewGame: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  state,
  onAction,
  onNewGame
}) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState<string | null>(null);
  const [showUltimateButton, setShowUltimateButton] = useState<boolean>(false);
  const [ultimateReady, setUltimateReady] = useState<boolean>(false);

  // Check if ultimate is ready
  useEffect(() => {
    setUltimateReady(state.playerUltimateCharge >= 100);
  }, [state.playerUltimateCharge]);

  // Show ultimate button animation when ready
  useEffect(() => {
    if (ultimateReady) {
      setShowUltimateButton(true);
    }
  }, [ultimateReady]);

  const renderHealthBar = (current: number, max: number, color: string) => (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${(current / max) * 100}%` }}
      />
    </div>
  );

  const renderManaBar = (current: number, max: number) => (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${(current / max) * 100}%` }}
      />
    </div>
  );

  const renderUltimateBar = (charge: number) => (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
        style={{ width: `${charge}%` }}
      />
    </div>
  );

  const renderStatusEffects = (statusEffects: any[]) => {
    if (statusEffects.length === 0) return null;
    
    return (
      <div className="flex gap-1 mt-1">
        {statusEffects.map((effect, index) => {
          let icon;
          switch (effect.effect.type) {
            case 'ATTACK_BOOST':
              icon = <Flame className="w-3 h-3 text-red-400" />;
              break;
            case 'DEFENSE_BOOST':
              icon = <Shield className="w-3 h-3 text-blue-400" />;
              break;
            case 'SPEED_BOOST':
              icon = <Zap className="w-3 h-3 text-yellow-400" />;
              break;
            case 'CRITICAL_BOOST':
              icon = <Star className="w-3 h-3 text-purple-400" />;
              break;
            default:
              icon = <Info className="w-3 h-3 text-white/60" />;
          }
          
          return (
            <div 
              key={`${effect.id}-${index}`} 
              className="bg-white/10 rounded-full p-1" 
              title={`${effect.name} (${Math.ceil(effect.timeLeft / 1000)}s)`}
            >
              {icon}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPowerUpButton = (powerUp: PowerUp) => {
    let Icon = powerUp.icon;
    
    return (
      <button
        key={powerUp.id}
        onClick={() => {
          setSelectedPowerUp(powerUp.id);
          onAction({ type: 'USE_POWER_UP', powerUpId: powerUp.id });
        }}
        className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-1 ${
          selectedPowerUp === powerUp.id
            ? 'bg-purple-500/50 border border-purple-400'
            : 'bg-white/5 hover:bg-white/10 border border-transparent'
        }`}
        title={`${powerUp.name}: ${powerUp.description} (${powerUp.duration / 1000}s)`}
      >
        <Icon className="w-5 h-5 text-purple-400" />
        <span className="text-xs">{powerUp.name}</span>
      </button>
    );
  };

  // Game Over Popup
  const renderGameOverPopup = () => {
    const isVictory = state.aiHP <= 0;
    const color = isVictory ? 'bg-green-500' : 'bg-red-500';
    const message = isVictory 
      ? `Victory! You earned ${state.tokens} tokens!`
      : 'Defeat! Better luck next time!';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass border border-white/10 rounded-xl p-8 w-[400px] text-center">
          <div className={`w-20 h-20 mx-auto rounded-full ${color}/20 flex items-center justify-center mb-4`}>
            <div className={`text-4xl ${color}`}>
              {isVictory ? '🏆' : '💀'}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isVictory ? 'Victory!' : 'Defeat!'}
          </h2>
          <p className="text-white/60 mb-6">{message}</p>
          <button
            onClick={onNewGame}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

  // HP/MP Info Tooltip
  const renderStatsInfo = () => (
    <div className="absolute top-4 right-4 group">
      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
        <Info className="w-4 h-4" />
      </button>
      <div className="absolute right-0 mt-2 w-64 p-4 glass border border-white/10 rounded-lg invisible group-hover:visible z-10">
        <h4 className="font-medium mb-2">Battle Stats</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="font-medium">HP (Health Points)</span>
            </div>
            <p className="text-sm text-white/60">Your character's life force. Reaches 0 and you lose!</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="font-medium">MP (Mana Points)</span>
            </div>
            <p className="text-sm text-white/60">Magic energy for special attacks. Recovers when defending.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="font-medium">Ultimate Charge</span>
            </div>
            <p className="text-sm text-white/60">Builds up during battle. Use for devastating ultimate attacks.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="font-medium">Combo System</span>
            </div>
            <p className="text-sm text-white/60">Chain attacks to build combos for increased damage.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      <div className="p-6 h-full">
        {/* Battle Arena */}
        <div className="flex-1 mb-6">
          <div className="grid grid-cols-2 gap-12 mb-8">
            {/* Player Character */}
            <div className="text-center">
              <div className="relative mb-4">
                <img
                  src={state.playerCharacter?.image}
                  alt={state.playerCharacter?.name}
                  className={`w-32 h-32 mx-auto rounded-full ${state.turn === 'player' ? 'ring-2 ring-blue-500 animate-pulse' : ''}`}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-sm font-medium">
                  Lv. 1
                </div>
                
                {/* Status effects */}
                <div className="absolute top-0 right-0">
                  {renderStatusEffects(state.playerStatusEffects)}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{state.playerCharacter?.name}</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>HP</span>
                    <span>{Math.ceil(state.playerHP)}/{state.playerMaxHP}</span>
                  </div>
                  {renderHealthBar(state.playerHP, state.playerMaxHP, 'bg-gradient-to-r from-green-500 to-green-400')}
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>MP</span>
                    <span>{state.playerMP}/{state.playerMaxMP}</span>
                  </div>
                  {renderManaBar(state.playerMP, state.playerMaxMP)}
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ultimate</span>
                    <span>{state.playerUltimateCharge}%</span>
                  </div>
                  {renderUltimateBar(state.playerUltimateCharge)}
                </div>
              </div>
            </div>

            {/* AI Character */}
            <div className="text-center">
              <div className="relative mb-4">
                <img
                  src={state.aiCharacter?.image}
                  alt={state.aiCharacter?.name}
                  className={`w-32 h-32 mx-auto rounded-full ${state.turn === 'ai' ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-red-500 text-sm font-medium">
                  Lv. 1
                </div>
                
                {/* Status effects */}
                <div className="absolute top-0 right-0">
                  {renderStatusEffects(state.aiStatusEffects)}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{state.aiCharacter?.name}</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>HP</span>
                    <span>{Math.ceil(state.aiHP)}/{state.aiMaxHP}</span>
                  </div>
                  {renderHealthBar(state.aiHP, state.aiMaxHP, 'bg-gradient-to-r from-red-500 to-red-400')}
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>MP</span>
                    <span>{state.aiMP}/{state.aiMaxMP}</span>
                  </div>
                  {renderManaBar(state.aiMP, state.aiMaxMP)}
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ultimate</span>
                    <span>{state.aiUltimateCharge}%</span>
                  </div>
                  {renderUltimateBar(state.aiUltimateCharge)}
                </div>
              </div>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="flex justify-center mb-8">
            <div className={`px-6 py-2 rounded-full text-lg font-medium ${
              state.turn === 'player' ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              {state.turn === 'player' ? 'Your Turn' : 'Opponent\'s Turn'}
            </div>
          </div>

          {/* Battle Log */}
          <div className="bg-white/5 rounded-xl p-4 h-32 overflow-y-auto mb-6">
            {state.battleLogs.map((log, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  log.type === 'PLAYER_ATTACK' ? 'text-blue-400' :
                  log.type === 'AI_ATTACK' ? 'text-red-400' :
                  log.type === 'POWER_UP' ? 'text-purple-400' :
                  log.type === 'ULTIMATE' ? 'text-yellow-400' :
                  log.type === 'GAME_OVER' ? 'text-yellow-400' :
                  'text-white/60'
                }`}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <button
              onClick={() => onAction({ type: 'QUICK_ATTACK' })}
              disabled={state.turn !== 'player'}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Swords className="w-5 h-5" />
              Quick Attack
            </button>
            <button
              onClick={() => onAction({ type: 'HEAVY_ATTACK' })}
              disabled={state.turn !== 'player'}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Swords className="w-5 h-5" />
              Heavy Attack
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => onAction({ type: 'SPECIAL_ATTACK' })}
              disabled={state.turn !== 'player' || state.playerMP < 40}
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Special Attack (40 MP)
            </button>
            <button
              onClick={() => onAction({ type: 'DEFEND' })}
              disabled={state.turn !== 'player'}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Defend
            </button>
          </div>
        </div>

        {/* Power-ups and Ultimate */}
        <div className="mt-4 flex justify-between items-center">
          {/* Power-ups */}
          <div className="flex gap-2">
            {state.availablePowerUps.map(powerUp => renderPowerUpButton(powerUp))}
          </div>
          
          {/* Ultimate attack button */}
          {ultimateReady && (
            <button
              onClick={() => onAction({ type: 'ULTIMATE' })}
              disabled={state.turn !== 'player' || state.playerUltimateCharge < 100}
              className={`py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                showUltimateButton ? 'animate-pulse shadow-lg shadow-purple-500/30' : ''
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Ultimate Attack</span>
            </button>
          )}
          
          {/* Token Counter */}
          <div className="text-center text-white/60">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>Tokens: {state.tokens}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Info */}
      {renderStatsInfo()}

      {/* Game Over Popup */}
      {state.isGameOver && renderGameOverPopup()}
    </div>
  );
};