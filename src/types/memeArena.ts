export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
  };
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  duration: number;
  effect: {
    type: 'ATTACK_BOOST' | 'DEFENSE_BOOST' | 'SPEED_BOOST' | 'CRITICAL_BOOST' | 'HEALING' | 'MANA_RESTORE' | 'COMBO_EXTENDER';
    value: number;
  };
  icon: React.ElementType;
}

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  timeLeft: number;
  effect: {
    type: 'ATTACK_BOOST' | 'DEFENSE_BOOST' | 'SPEED_BOOST' | 'CRITICAL_BOOST' | 'HEALING' | 'MANA_RESTORE' | 'COMBO_EXTENDER';
    value: number;
  };
}

export interface GameState {
  screen: 'character-select' | 'battle';
  playerCharacter: Character | null;
  aiCharacter: Character | null;
  playerHP: number;
  playerMaxHP: number;
  playerMP: number;
  playerMaxMP: number;
  aiHP: number;
  aiMaxHP: number;
  aiMP: number;
  aiMaxMP: number;
  turn: 'player' | 'ai';
  battleLogs: BattleLog[];
  tokens: number;
  isGameOver: boolean;
  combo: number;
  comboMultiplier: number;
  lastAction: string | null;
  criticalHit: boolean;
  powerUps: PowerUp[];
  availablePowerUps: PowerUp[];
  playerStatusEffects: StatusEffect[];
  aiStatusEffects: StatusEffect[];
  battleTurn: number;
  playerConsecutiveDefends: number;
  aiConsecutiveDefends: number;
  playerUltimateCharge: number;
  aiUltimateCharge: number;
}

export interface Action {
  type: 'QUICK_ATTACK' | 'HEAVY_ATTACK' | 'SPECIAL_ATTACK' | 'DEFEND' | 'USE_POWER_UP' | 'ULTIMATE';
  powerUpId?: string;
}

export interface BattleLog {
  type: 'BATTLE_START' | 'PLAYER_ATTACK' | 'AI_ATTACK' | 'PLAYER_DEFEND' | 'AI_DEFEND' | 'GAME_OVER' | 'ERROR' | 'POWER_UP' | 'ULTIMATE';
  text: string;
}