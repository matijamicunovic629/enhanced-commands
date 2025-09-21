export interface MiningNode {
  id: string;
  type: 'copper' | 'silver' | 'gold' | 'diamond' | 'special';
  value: number;
  health: number;
  maxHealth: number;
  position: { x: number; y: number };
  size: number;
  mined: boolean;
  discovered: boolean;
  glowing?: boolean;
  minedTime?: number;
}

export interface Bandit {
  id: string;
  type: 'normal' | 'elite' | 'boss';
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  position: { x: number; y: number };
  direction: { x: number; y: number };
  size: number;
  active: boolean;
  stunned: boolean;
  stunnedTime: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effect: (level: number) => number;
  icon: string;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  duration: number;
  timeLeft: number;
  active: boolean;
  icon: string;
  effect: string;
  position?: { x: number; y: number };
}

export interface GameState {
  screen: 'menu' | 'game' | 'upgrade' | 'gameover';
  level: number;
  tokens: number;
  score: number;
  health: number;
  maxHealth: number;
  miningPower: number;
  defense: number;
  speed: number;
  criticalChance: number;
  criticalMultiplier: number;
  comboMultiplier: number;
  comboCount: number;
  comboTimer: number;
  maxComboTimer: number;
  nodes: MiningNode[];
  bandits: Bandit[];
  upgrades: Upgrade[];
  powerUps: PowerUp[];
  activePowerUps: PowerUp[];
  gameTime: number;
  miningSpeed: number;
  nodeSpawnRate: number;
  banditSpawnRate: number;
  playerPosition: { x: number; y: number };
  playerSize: number;
  playerInvincible: boolean;
  playerInvincibleTime: number;
  lastHitTime: number;
  gameOver: boolean;
  gameOverReason: string;
  paused: boolean;
  totalNodesDiscovered: number;
  totalNodesMined: number;
  totalBanditsDefeated: number;
  totalPowerUpsCollected: number;
  highestLevel: number;
  tokensEarned: number;
}