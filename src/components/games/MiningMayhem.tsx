import React, { useState, useEffect, useRef } from 'react';
import { 
  Pickaxe, Heart, Shield, Zap, Coins, X, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  Pause, Play, RefreshCw, Settings, ChevronUp, 
  Award, Skull, Star, Clock, Sparkles
} from 'lucide-react';
import { useStore } from '../../store/useStore';

// Game types
type NodeType = 'copper' | 'silver' | 'gold' | 'diamond' | 'special';
type BanditType = 'normal' | 'elite' | 'boss';
type PowerUpType = 'health' | 'speed' | 'damage' | 'invincible' | 'magnet';

interface Node {
  id: string;
  type: NodeType;
  value: number;
  health: number;
  maxHealth: number;
  position: { x: number; y: number };
  size: number;
  mined: boolean;
  discovered: boolean;
  glowing?: boolean;
}

interface Bandit {
  id: string;
  type: BanditType;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  position: { x: number; y: number };
  direction: { x: number; y: number };
  size: number;
  stunned: boolean;
  stunnedTime: number;
}

interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  duration: number;
  timeLeft: number;
  position: { x: number; y: number };
}

interface Projectile {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  damage: number;
  speed: number;
  size: number;
  isCritical: boolean;
  timeLeft: number;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  getEffect: (level: number) => number;
  icon: React.ReactNode;
}

interface GameState {
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
  miningSpeed: number;
  comboCount: number;
  comboMultiplier: number;
  comboTimer: number;
  nodes: Node[];
  bandits: Bandit[];
  powerUps: PowerUp[];
  projectiles: Projectile[];
  upgrades: Upgrade[];
  playerPosition: { x: number; y: number };
  playerSize: number;
  playerInvincible: boolean;
  playerInvincibleTime: number;
  paused: boolean;
  gameOver: boolean;
  gameOverReason: string;
  totalNodesMined: number;
  totalBanditsDefeated: number;
  tokensEarned: number;
  lastFrameTime: number;
  shootCooldown: number;
  projectileSpeed: number;
  projectileSize: number;
  projectileDamage: number;
  projectileLifetime: number;
  aimDirection: { x: number; y: number };
}

export const MiningMayhem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const shootingRef = useRef<boolean>(false);
  const { updateGameStats, gameStats } = useStore();

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const NODE_COLORS: Record<NodeType, string> = {
    copper: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    diamond: '#b9f2ff',
    special: '#ff00ff'
  };
  const NODE_VALUES: Record<NodeType, number> = {
    copper: 5,
    silver: 10,
    gold: 20,
    diamond: 50,
    special: 100
  };
  const BANDIT_COLORS: Record<BanditType, string> = {
    normal: '#ff0000',
    elite: '#ff6600',
    boss: '#990000'
  };
  const GRID_SIZE = 40; // Size of grid cells

  // Initial game state
  const initialGameState: GameState = {
    screen: 'menu',
    level: 1,
    tokens: 0,
    score: 0,
    health: 100,
    maxHealth: 100,
    miningPower: 10,
    defense: 5,
    speed: 3,
    criticalChance: 0.05,
    criticalMultiplier: 1.5,
    miningSpeed: 1,
    comboCount: 0,
    comboMultiplier: 1,
    comboTimer: 0,
    nodes: [],
    bandits: [],
    powerUps: [],
    projectiles: [],
    upgrades: [
      {
        id: 'mining_power',
        name: 'Mining Power',
        description: 'Increases damage to nodes and bandits',
        cost: 50,
        level: 1,
        maxLevel: 10,
        getEffect: (level) => 10 + (level - 1) * 5,
        icon: <Pickaxe className="w-5 h-5 text-amber-400" />
      },
      {
        id: 'health',
        name: 'Max Health',
        description: 'Increases maximum health',
        cost: 50,
        level: 1,
        maxLevel: 10,
        getEffect: (level) => 100 + (level - 1) * 25,
        icon: <Heart className="w-5 h-5 text-red-400" />
      },
      {
        id: 'defense',
        name: 'Defense',
        description: 'Reduces damage taken from bandits',
        cost: 75,
        level: 1,
        maxLevel: 10,
        getEffect: (level) => 5 + (level - 1) * 3,
        icon: <Shield className="w-5 h-5 text-blue-400" />
      },
      {
        id: 'speed',
        name: 'Movement Speed',
        description: 'Increases movement speed',
        cost: 60,
        level: 1,
        maxLevel: 10,
        getEffect: (level) => 3 + (level - 1) * 0.5,
        icon: <Zap className="w-5 h-5 text-yellow-400" />
      },
      {
        id: 'critical_chance',
        name: 'Critical Chance',
        description: 'Increases chance of critical hits',
        cost: 100,
        level: 1,
        maxLevel: 10,
        getEffect: (level) => 0.05 + (level - 1) * 0.05,
        icon: <Star className="w-5 h-5 text-purple-400" />
      },
      {
        id: 'critical_multiplier',
        name: 'Critical Multiplier',
        description: 'Increases damage of critical hits',
        cost: 100,
        level: 1,
        maxLevel: 10,
        getEffect: (level) => 1.5 + (level - 1) * 0.2,
        icon: <Sparkles className="w-5 h-5 text-pink-400" />
      },
      {
        id: 'mining_speed',
        name: 'Mining Speed',
        description: 'Increases mining speed',
        cost: 80,
        level: 1,
        maxLevel: 10,
        getEffect: (level) => 1 + (level - 1) * 0.2,
        icon: <Clock className="w-5 h-5 text-cyan-400" />
      }
    ],
    playerPosition: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    playerSize: 20,
    playerInvincible: false,
    playerInvincibleTime: 0,
    paused: false,
    gameOver: false,
    gameOverReason: '',
    totalNodesMined: 0,
    totalBanditsDefeated: 0,
    tokensEarned: 0,
    lastFrameTime: 0,
    shootCooldown: 0,
    projectileSpeed: 8,
    projectileSize: 6,
    projectileDamage: 10,
    projectileLifetime: 1500,
    aimDirection: { x: 1, y: 0 }
  };

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showControls, setShowControls] = useState(false);
  const [showUpgradeNotification, setShowUpgradeNotification] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{
    id: string;
    text: string;
    position: { x: number; y: number };
    color: string;
    timeLeft: number;
  }[]>([]);
  const gameStateRef = useRef<GameState>(initialGameState);

  // Update gameStateRef when gameState changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Initialize game
  const startGame = () => {
    // Reset game state
    const newGameState = {
      ...initialGameState,
      screen: 'game',
      health: initialGameState.maxHealth,
      playerPosition: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
      nodes: [], // Start with empty nodes, we'll generate them immediately
      bandits: [],
      powerUps: [],
      projectiles: []
    };
    
    setGameState(newGameState);
    gameStateRef.current = newGameState;

    // Show controls
    setShowControls(true);
    setTimeout(() => setShowControls(false), 5000);

    // Generate initial nodes
    generateNodes(15);

    // Start game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Generate nodes
  const generateNodes = (count: number) => {
    const newNodes: Node[] = [];
    const currentState = gameStateRef.current;
    
    for (let i = 0; i < count; i++) {
      // Determine node type based on level and randomness
      let typeIndex = Math.min(
        Math.floor(Math.random() * Math.min(currentState.level, 5)),
        4
      );
      
      // Special nodes are rare
      if (typeIndex === 4 && Math.random() > 0.2) {
        typeIndex--;
      }
      
      const nodeTypes: NodeType[] = ['copper', 'silver', 'gold', 'diamond', 'special'];
      const type = nodeTypes[typeIndex];
      const value = NODE_VALUES[type] * (1 + (currentState.level - 1) * 0.2);
      const size = 30 + Math.random() * 20;
      
      // Position node away from player and other nodes
      let validPosition = false;
      let position = { x: 0, y: 0 };
      let attempts = 0;
      
      while (!validPosition && attempts < 50) {
        position = {
          x: Math.random() * (CANVAS_WIDTH - size * 2) + size,
          y: Math.random() * (CANVAS_HEIGHT - size * 2) + size
        };
        
        // Check distance from player
        const distToPlayer = Math.sqrt(
          Math.pow(position.x - currentState.playerPosition.x, 2) +
          Math.pow(position.y - currentState.playerPosition.y, 2)
        );
        
        if (distToPlayer > 100) {
          validPosition = true;
          
          // Check distance from other nodes
          for (const node of [...currentState.nodes, ...newNodes]) {
            const distToNode = Math.sqrt(
              Math.pow(position.x - node.position.x, 2) +
              Math.pow(position.y - node.position.y, 2)
            );
            
            if (distToNode < size + node.size) {
              validPosition = false;
              break;
            }
          }
        }
        
        attempts++;
      }
      
      // Create node
      const health = value * 10;
      newNodes.push({
        id: `node-${Date.now()}-${i}`,
        type,
        value,
        health,
        maxHealth: health,
        position,
        size,
        mined: false,
        discovered: true, // Make all nodes discovered by default for better gameplay
        glowing: Math.random() < 0.3 // Some nodes glow for visual interest
      });
    }
    
    setGameState(prev => ({
      ...prev,
      nodes: [...prev.nodes, ...newNodes]
    }));
  };

  // Spawn bandit
  const spawnBandit = () => {
    const currentState = gameStateRef.current;
    
    // Determine bandit type based on level
    let typeIndex = 0;
    const rand = Math.random();
    
    if (currentState.level >= 10 && rand < 0.1) {
      typeIndex = 2; // Boss (10%)
    } else if (currentState.level >= 5 && rand < 0.3) {
      typeIndex = 1; // Elite (20%)
    }
    
    const banditTypes: BanditType[] = ['normal', 'elite', 'boss'];
    const type = banditTypes[typeIndex];
    
    // Bandit stats based on type and level
    const healthMultiplier = type === 'normal' ? 1 : type === 'elite' ? 2 : 5;
    const damageMultiplier = type === 'normal' ? 1 : type === 'elite' ? 1.5 : 3;
    const speedMultiplier = type === 'normal' ? 1 : type === 'elite' ? 0.8 : 0.6;
    const sizeMultiplier = type === 'normal' ? 1 : type === 'elite' ? 1.2 : 1.5;
    
    const health = 50 * healthMultiplier * (1 + (currentState.level - 1) * 0.3);
    const damage = 10 * damageMultiplier * (1 + (currentState.level - 1) * 0.2);
    const speed = 1.5 * speedMultiplier * (1 + (currentState.level - 1) * 0.1);
    const size = 25 * sizeMultiplier;
    
    // Spawn bandit at edge of screen
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let position = { x: 0, y: 0 };
    
    switch (edge) {
      case 0: // top
        position = { x: Math.random() * CANVAS_WIDTH, y: -size };
        break;
      case 1: // right
        position = { x: CANVAS_WIDTH + size, y: Math.random() * CANVAS_HEIGHT };
        break;
      case 2: // bottom
        position = { x: Math.random() * CANVAS_WIDTH, y: CANVAS_HEIGHT + size };
        break;
      case 3: // left
        position = { x: -size, y: Math.random() * CANVAS_HEIGHT };
        break;
    }
    
    // Direction towards player
    const dx = currentState.playerPosition.x - position.x;
    const dy = currentState.playerPosition.y - position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const direction = { x: dx / dist, y: dy / dist };
    
    const newBandit: Bandit = {
      id: `bandit-${Date.now()}`,
      type,
      health,
      maxHealth: health,
      damage,
      speed,
      position,
      direction,
      size,
      stunned: false,
      stunnedTime: 0
    };
    
    setGameState(prev => ({
      ...prev,
      bandits: [...prev.bandits, newBandit]
    }));
  };

  // Spawn power-up
  const spawnPowerUp = () => {
    const currentState = gameStateRef.current;
    
    const powerUpTypes: { type: PowerUpType; name: string; duration: number }[] = [
      { type: 'health', name: 'Health Boost', duration: 0 },
      { type: 'speed', name: 'Speed Boost', duration: 15000 },
      { type: 'damage', name: 'Damage Boost', duration: 10000 },
      { type: 'invincible', name: 'Invincibility', duration: 5000 },
      { type: 'magnet', name: 'Node Magnet', duration: 20000 }
    ];
    
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    // Position power-up away from player
    let validPosition = false;
    let position = { x: 0, y: 0 };
    let attempts = 0;
    
    while (!validPosition && attempts < 50) {
      position = {
        x: Math.random() * (CANVAS_WIDTH - 40) + 20,
        y: Math.random() * (CANVAS_HEIGHT - 40) + 20
      };
      
      // Check distance from player
      const distToPlayer = Math.sqrt(
        Math.pow(position.x - currentState.playerPosition.x, 2) +
        Math.pow(position.y - currentState.playerPosition.y, 2)
      );
      
      if (distToPlayer > 150) {
        validPosition = true;
      }
      
      attempts++;
    }
    
    const newPowerUp: PowerUp = {
      id: `powerup-${Date.now()}`,
      type: randomType.type,
      name: randomType.name,
      duration: randomType.duration,
      timeLeft: randomType.duration,
      position
    };
    
    setGameState(prev => ({
      ...prev,
      powerUps: [...prev.powerUps, newPowerUp]
    }));
  };

  // Add floating text
  const addFloatingText = (text: string, position: { x: number; y: number }, color: string) => {
    const newText = {
      id: `text-${Date.now()}-${Math.random()}`,
      text,
      position: { ...position, y: position.y - 20 }, // Offset above the target
      color,
      timeLeft: 1500 // 1.5 seconds
    };
    
    setFloatingTexts(prev => [...prev, newText]);
  };

  // Update floating texts
  const updateFloatingTexts = (deltaTime: number) => {
    setFloatingTexts(prev => 
      prev
        .map(text => ({
          ...text,
          position: { ...text.position, y: text.position.y - 0.05 * deltaTime }, // Float upward
          timeLeft: text.timeLeft - deltaTime
        }))
        .filter(text => text.timeLeft > 0) // Remove expired texts
    );
  };

  // Shoot projectile
  const shootProjectile = () => {
    const currentState = gameStateRef.current;
    
    // Check if shooting is on cooldown
    if (currentState.shootCooldown > 0) return;
    
    // Calculate aim direction
    let aimDirection = { ...currentState.aimDirection };
    
    // If keys are pressed, update aim direction
    if (keysRef.current.size > 0) {
      let dx = 0;
      let dy = 0;
      
      if (keysRef.current.has('ArrowUp') || keysRef.current.has('w') || keysRef.current.has('W')) {
        dy -= 1;
      }
      if (keysRef.current.has('ArrowDown') || keysRef.current.has('s') || keysRef.current.has('S')) {
        dy += 1;
      }
      if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || keysRef.current.has('A')) {
        dx -= 1;
      }
      if (keysRef.current.has('ArrowRight') || keysRef.current.has('d') || keysRef.current.has('D')) {
        dx += 1;
      }
      
      // If there's input, update aim direction
      if (dx !== 0 || dy !== 0) {
        const length = Math.sqrt(dx * dx + dy * dy);
        aimDirection = { x: dx / length, y: dy / length };
      }
    }
    
    // Calculate damage
    let damage = currentState.projectileDamage;
    
    // Apply damage boost from power-ups
    if (currentState.powerUps.some(p => p.type === 'damage' && p.timeLeft > 0)) {
      damage *= 2;
    }
    
    // Critical hit chance
    const isCritical = Math.random() < currentState.criticalChance;
    if (isCritical) {
      damage *= currentState.criticalMultiplier;
    }
    
    // Create projectile
    const newProjectile: Projectile = {
      id: `projectile-${Date.now()}-${Math.random()}`,
      position: { ...currentState.playerPosition },
      velocity: { 
        x: aimDirection.x * currentState.projectileSpeed,
        y: aimDirection.y * currentState.projectileSpeed
      },
      damage,
      speed: currentState.projectileSpeed,
      size: currentState.projectileSize,
      isCritical,
      timeLeft: currentState.projectileLifetime
    };
    
    // Add projectile to game state
    setGameState(prev => ({
      ...prev,
      projectiles: [...prev.projectiles, newProjectile],
      shootCooldown: 300, // 300ms cooldown between shots
      aimDirection
    }));
  };

  // Update projectiles
  const updateProjectiles = (deltaTime: number) => {
    const currentState = gameStateRef.current;
    
    // Update projectile positions and check for collisions
    const updatedProjectiles = currentState.projectiles
      .map(projectile => {
        // Update position
        const newPosition = {
          x: projectile.position.x + projectile.velocity.x * (deltaTime / 16.67),
          y: projectile.position.y + projectile.velocity.y * (deltaTime / 16.67)
        };
        
        // Update time left
        const newTimeLeft = projectile.timeLeft - deltaTime;
        
        return {
          ...projectile,
          position: newPosition,
          timeLeft: newTimeLeft
        };
      })
      .filter(projectile => {
        // Remove projectiles that are out of bounds
        if (
          projectile.position.x < 0 ||
          projectile.position.x > CANVAS_WIDTH ||
          projectile.position.y < 0 ||
          projectile.position.y > CANVAS_HEIGHT ||
          projectile.timeLeft <= 0
        ) {
          return false;
        }
        
        // Check collision with nodes
        let hitNode = false;
        
        currentState.nodes.forEach(node => {
          if (node.mined || hitNode) return;
          
          const dist = Math.sqrt(
            Math.pow(projectile.position.x - node.position.x, 2) +
            Math.pow(projectile.position.y - node.position.y, 2)
          );
          
          if (dist < node.size + projectile.size) {
            hitNode = true;
            
            // Apply damage to node
            const newHealth = Math.max(0, node.health - projectile.damage);
            const mined = newHealth <= 0;
            
            // Show damage text
            if (projectile.isCritical) {
              addFloatingText(`CRITICAL! ${Math.round(projectile.damage)}`, node.position, '#ff0');
            } else {
              addFloatingText(`${Math.round(projectile.damage)}`, node.position, '#fff');
            }
            
            // If node is mined, add value to score and tokens
            if (mined && !node.mined) {
              const nodeValue = Math.round(node.value * currentState.comboMultiplier);
              
              addFloatingText(`+${nodeValue} tokens!`, node.position, '#0f0');
              
              setGameState(prev => {
                const newScore = prev.score + nodeValue;
                const newTokens = prev.tokens + nodeValue;
                const newComboCount = prev.comboCount + 1;
                const newComboMultiplier = Math.min(5, 1 + (newComboCount * 0.1));
                
                return {
                  ...prev,
                  score: newScore,
                  tokens: newTokens,
                  comboCount: newComboCount,
                  comboMultiplier: newComboMultiplier,
                  comboTimer: 3000, // Reset combo timer
                  totalNodesMined: prev.totalNodesMined + 1,
                  tokensEarned: prev.tokensEarned + nodeValue,
                  nodes: prev.nodes.map(n => 
                    n.id === node.id ? { ...n, health: newHealth, mined } : n
                  )
                };
              });
              
              // Show upgrade notification if enough tokens
              const cheapestUpgrade = Math.min(...currentState.upgrades.map(u => 
                u.level < u.maxLevel ? u.cost * Math.pow(1.5, u.level - 1) : Infinity
              ));
              
              if (currentState.tokens + nodeValue >= cheapestUpgrade) {
                setShowUpgradeNotification(true);
                setTimeout(() => setShowUpgradeNotification(false), 3000);
              }
            } else {
              // Just update node health
              setGameState(prev => ({
                ...prev,
                nodes: prev.nodes.map(n => 
                  n.id === node.id ? { ...n, health: newHealth, mined } : n
                )
              }));
            }
          }
        });
        
        if (hitNode) return false;
        
        // Check collision with bandits
        let hitBandit = false;
        
        currentState.bandits.forEach(bandit => {
          if (bandit.stunned || hitBandit) return;
          
          const dist = Math.sqrt(
            Math.pow(projectile.position.x - bandit.position.x, 2) +
            Math.pow(projectile.position.y - bandit.position.y, 2)
          );
          
          if (dist < bandit.size + projectile.size) {
            hitBandit = true;
            
            // Apply damage to bandit
            const newHealth = Math.max(0, bandit.health - projectile.damage);
            const defeated = newHealth <= 0;
            
            // Show damage text
            if (projectile.isCritical) {
              addFloatingText(`CRITICAL! ${Math.round(projectile.damage)}`, bandit.position, '#ff0');
            } else {
              addFloatingText(`${Math.round(projectile.damage)}`, bandit.position, '#fff');
            }
            
            // If bandit is defeated, add tokens
            if (defeated) {
              const banditValue = bandit.type === 'normal' ? 20 : bandit.type === 'elite' ? 50 : 200;
              const tokenReward = Math.round(banditValue * currentState.comboMultiplier);
              
              addFloatingText(`+${tokenReward} tokens!`, bandit.position, '#0f0');
              
              setGameState(prev => {
                const newTokens = prev.tokens + tokenReward;
                const newComboCount = prev.comboCount + 1;
                const newComboMultiplier = Math.min(5, 1 + (newComboCount * 0.1));
                
                return {
                  ...prev,
                  tokens: newTokens,
                  comboCount: newComboCount,
                  comboMultiplier: newComboMultiplier,
                  comboTimer: 3000, // Reset combo timer
                  totalBanditsDefeated: prev.totalBanditsDefeated + 1,
                  tokensEarned: prev.tokensEarned + tokenReward,
                  bandits: prev.bandits.filter(b => b.id !== bandit.id)
                };
              });
              
              // Show upgrade notification if enough tokens
              const cheapestUpgrade = Math.min(...currentState.upgrades.map(u => 
                u.level < u.maxLevel ? u.cost * Math.pow(1.5, u.level - 1) : Infinity
              ));
              
              if (currentState.tokens + tokenReward >= cheapestUpgrade) {
                setShowUpgradeNotification(true);
                setTimeout(() => setShowUpgradeNotification(false), 3000);
              }
            } else {
              // Just update bandit health and stun it
              setGameState(prev => ({
                ...prev,
                bandits: prev.bandits.map(b => 
                  b.id === bandit.id ? { 
                    ...b, 
                    health: newHealth,
                    stunned: true,
                    stunnedTime: 500 // Stun for 0.5 seconds
                  } : b
                )
              }));
            }
          }
        });
        
        if (hitBandit) return false;
        
        return true;
      });
    
    setGameState(prev => ({
      ...prev,
      projectiles: updatedProjectiles
    }));
  };

  // Game loop
  const gameLoop = (timestamp: number) => {
    const currentState = gameStateRef.current;
    
    if (currentState.screen !== 'game' || currentState.paused || currentState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Calculate delta time
    const deltaTime = currentState.lastFrameTime ? timestamp - currentState.lastFrameTime : 16.67;
    
    // Update player position
    updatePlayerPosition(deltaTime);
    
    // Handle shooting if active
    if (shootingRef.current) {
      shootProjectile();
    }
    
    // Update shoot cooldown
    if (currentState.shootCooldown > 0) {
      setGameState(prev => ({
        ...prev,
        shootCooldown: Math.max(0, prev.shootCooldown - deltaTime)
      }));
    }
    
    // Update projectiles
    updateProjectiles(deltaTime);
    
    // Update bandits
    updateBandits(deltaTime);
    
    // Update power-ups
    updatePowerUps(deltaTime);
    
    // Update combo timer
    updateCombo(deltaTime);
    
    // Update player invincibility
    updateInvincibility(deltaTime);
    
    // Update floating texts
    updateFloatingTexts(deltaTime);
    
    // Spawn entities based on time
    handleSpawning();
    
    // Check for level up
    checkLevelUp();
    
    // Draw game
    drawGame();
    
    // Update last frame time
    setGameState(prev => ({
      ...prev,
      lastFrameTime: timestamp
    }));
    
    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Update player position
  const updatePlayerPosition = (deltaTime: number) => {
    const currentState = gameStateRef.current;
    const speed = currentState.speed * (deltaTime / 16.67); // Normalize for 60fps
    let dx = 0;
    let dy = 0;
    
    // Check which keys are pressed
    if (keysRef.current.has('ArrowUp') || keysRef.current.has('w') || keysRef.current.has('W')) {
      dy -= speed;
    }
    if (keysRef.current.has('ArrowDown') || keysRef.current.has('s') || keysRef.current.has('S')) {
      dy += speed;
    }
    if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || keysRef.current.has('A')) {
      dx -= speed;
    }
    if (keysRef.current.has('ArrowRight') || keysRef.current.has('d') || keysRef.current.has('D')) {
      dx += speed;
    }
    
    // Apply speed boost from power-ups
    if (currentState.powerUps.some(p => p.type === 'speed' && p.timeLeft > 0)) {
      dx *= 1.5;
      dy *= 1.5;
    }
    
    // Update player position
    if (dx !== 0 || dy !== 0) {
      const newX = Math.max(currentState.playerSize, Math.min(CANVAS_WIDTH - currentState.playerSize, currentState.playerPosition.x + dx));
      const newY = Math.max(currentState.playerSize, Math.min(CANVAS_HEIGHT - currentState.playerSize, currentState.playerPosition.y + dy));
      
      setGameState(prev => ({
        ...prev,
        playerPosition: { x: newX, y: newY }
      }));
    }
  };

  // Update bandits
  const updateBandits = (deltaTime: number) => {
    const currentState = gameStateRef.current;
    
    const updatedBandits = currentState.bandits.map(bandit => {
      // Update stunned state
      if (bandit.stunned) {
        const newStunnedTime = bandit.stunnedTime - deltaTime;
        if (newStunnedTime <= 0) {
          return {
            ...bandit,
            stunned: false,
            stunnedTime: 0
          };
        }
        return {
          ...bandit,
          stunnedTime: newStunnedTime
        };
      }
      
      // Update direction towards player
      const dx = currentState.playerPosition.x - bandit.position.x;
      const dy = currentState.playerPosition.y - bandit.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const newDirection = { x: dx / dist, y: dy / dist };
      
      // Move bandit
      const newPosition = {
        x: bandit.position.x + newDirection.x * bandit.speed * (deltaTime / 16.67),
        y: bandit.position.y + newDirection.y * bandit.speed * (deltaTime / 16.67)
      };
      
      // Check collision with player
      const distToPlayer = Math.sqrt(
        Math.pow(newPosition.x - currentState.playerPosition.x, 2) +
        Math.pow(newPosition.y - currentState.playerPosition.y, 2)
      );
      
      if (distToPlayer < bandit.size + currentState.playerSize && !currentState.playerInvincible) {
        // Calculate damage to player
        const damage = Math.max(1, bandit.damage - currentState.defense);
        
        // Add floating text for damage taken
        addFloatingText(`-${Math.round(damage)}`, currentState.playerPosition, '#f00');
        
        // Apply damage to player
        setGameState(prev => {
          const newHealth = Math.max(0, prev.health - damage);
          
          // Check if player is defeated
          if (newHealth <= 0) {
            return {
              ...prev,
              health: 0,
              gameOver: true,
              gameOverReason: 'You were defeated by bandits!'
            };
          }
          
          return {
            ...prev,
            health: newHealth,
            playerInvincible: true,
            playerInvincibleTime: 1000, // 1 second of invincibility after hit
            comboCount: 0, // Reset combo
            comboMultiplier: 1
          };
        });
      }
      
      return {
        ...bandit,
        position: newPosition,
        direction: newDirection
      };
    });
    
    setGameState(prev => ({
      ...prev,
      bandits: updatedBandits
    }));
  };

  // Update power-ups
  const updatePowerUps = (deltaTime: number) => {
    const currentState = gameStateRef.current;
    
    // Update active power-ups
    const updatedPowerUps = currentState.powerUps.map(powerUp => {
      // Skip instant power-ups
      if (powerUp.duration === 0) return powerUp;
      
      // Update time left
      const newTimeLeft = Math.max(0, powerUp.timeLeft - deltaTime);
      return {
        ...powerUp,
        timeLeft: newTimeLeft
      };
    }).filter(p => p.duration === 0 || p.timeLeft > 0); // Remove expired power-ups
    
    // Check for power-up collection
    const remainingPowerUps = updatedPowerUps.filter(powerUp => {
      const dist = Math.sqrt(
        Math.pow(powerUp.position.x - currentState.playerPosition.x, 2) +
        Math.pow(powerUp.position.y - currentState.playerPosition.y, 2)
      );
      
      // Collect power-up if close enough
      if (dist < 30 + currentState.playerSize) {
        // Apply power-up effect
        if (powerUp.type === 'health') {
          // Instant health boost
          const healAmount = Math.round(currentState.maxHealth * 0.3);
          addFloatingText(`+${healAmount} HP`, currentState.playerPosition, '#0f0');
          
          setGameState(prev => ({
            ...prev,
            health: Math.min(prev.maxHealth, prev.health + healAmount)
          }));
        } else {
          // Show power-up activation message
          addFloatingText(`${powerUp.name} activated!`, currentState.playerPosition, '#0ff');
        }
        
        return false; // Remove collected power-up
      }
      
      return true; // Keep power-up
    });
    
    setGameState(prev => ({
      ...prev,
      powerUps: remainingPowerUps
    }));
  };

  // Update combo
  const updateCombo = (deltaTime: number) => {
    const currentState = gameStateRef.current;
    
    if (currentState.comboTimer > 0) {
      const newComboTimer = currentState.comboTimer - deltaTime;
      
      if (newComboTimer <= 0) {
        // Reset combo
        setGameState(prev => ({
          ...prev,
          comboCount: 0,
          comboMultiplier: 1,
          comboTimer: 0
        }));
      } else {
        // Update combo timer
        setGameState(prev => ({
          ...prev,
          comboTimer: newComboTimer
        }));
      }
    }
  };

  // Update player invincibility
  const updateInvincibility = (deltaTime: number) => {
    const currentState = gameStateRef.current;
    
    if (currentState.playerInvincible) {
      const newInvincibleTime = currentState.playerInvincibleTime - deltaTime;
      
      if (newInvincibleTime <= 0) {
        setGameState(prev => ({
          ...prev,
          playerInvincible: false,
          playerInvincibleTime: 0
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          playerInvincibleTime: newInvincibleTime
        }));
      }
    }
  };

  // Handle spawning of entities
  const handleSpawning = () => {
    const currentState = gameStateRef.current;
    
    // Spawn nodes if needed
    if (currentState.nodes.filter(n => !n.mined).length < 5) {
      generateNodes(5);
    }
    
    // Spawn bandits based on level
    if (Math.random() < 0.01 * currentState.level && currentState.bandits.length < 5 + currentState.level) {
      spawnBandit();
    }
    
    // Spawn power-ups occasionally
    if (Math.random() < 0.002 * currentState.level && currentState.powerUps.length < 3) {
      spawnPowerUp();
    }
  };

  // Check for level up
  const checkLevelUp = () => {
    const currentState = gameStateRef.current;
    
    // Level up based on score
    const newLevel = Math.floor(currentState.score / 1000) + 1;
    
    if (newLevel > currentState.level) {
      addFloatingText(`Level Up! ${newLevel}`, currentState.playerPosition, '#ff0');
      
      setGameState(prev => ({
        ...prev,
        level: newLevel,
        health: prev.maxHealth // Restore health on level up
      }));
    }
  };

  // Draw game
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentState = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    
    // Draw vertical grid lines
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
    
    // Draw grid intersections
    ctx.fillStyle = '#333';
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
      for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
    
    // Draw nodes
    currentState.nodes.forEach(node => {
      if (!node.discovered) return;
      
      // Draw node glow for special nodes
      if (node.glowing) {
        ctx.save();
        ctx.globalAlpha = 0.2 + 0.1 * Math.sin(Date.now() / 500);
        ctx.fillStyle = NODE_COLORS[node.type];
        ctx.beginPath();
        ctx.arc(node.position.x, node.position.y, node.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      // Draw node
      ctx.fillStyle = NODE_COLORS[node.type];
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, node.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, node.size, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw node type indicator
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let icon = '';
      switch (node.type) {
        case 'copper':
          icon = 'Cu';
          break;
        case 'silver':
          icon = 'Ag';
          break;
        case 'gold':
          icon = 'Au';
          break;
        case 'diamond':
          icon = '💎';
          break;
        case 'special':
          icon = '⭐';
          break;
      }
      
      ctx.fillText(icon, node.position.x, node.position.y);
      
      // Draw health bar if not mined
      if (!node.mined) {
        const healthBarWidth = node.size * 2;
        const healthBarHeight = 6;
        const healthBarX = node.position.x - healthBarWidth / 2;
        const healthBarY = node.position.y - node.size - 10;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // Health
        ctx.fillStyle = '#0f0';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * (node.health / node.maxHealth), healthBarHeight);
      }
    });
    
    // Draw bandits
    currentState.bandits.forEach(bandit => {
      // Draw bandit glow
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = BANDIT_COLORS[bandit.type];
      ctx.beginPath();
      ctx.arc(bandit.position.x, bandit.position.y, bandit.size * 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Draw bandit
      ctx.fillStyle = BANDIT_COLORS[bandit.type];
      ctx.beginPath();
      ctx.arc(bandit.position.x, bandit.position.y, bandit.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw bandit border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bandit.position.x, bandit.position.y, bandit.size, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw bandit type indicator
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let icon = '';
      switch (bandit.type) {
        case 'normal':
          icon = '👹';
          break;
        case 'elite':
          icon = '👺';
          break;
        case 'boss':
          icon = '👿';
          break;
      }
      
      ctx.fillText(icon, bandit.position.x, bandit.position.y);
      
      // Draw stunned indicator
      if (bandit.stunned) {
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', bandit.position.x, bandit.position.y - bandit.size - 10);
      }
      
      // Draw health bar
      const healthBarWidth = bandit.size * 2;
      const healthBarHeight = 6;
      const healthBarX = bandit.position.x - healthBarWidth / 2;
      const healthBarY = bandit.position.y - bandit.size - 10;
      
      // Background
      ctx.fillStyle = '#333';
      ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
      
      // Health
      ctx.fillStyle = '#f00';
      ctx.fillRect(healthBarX, healthBarY, healthBarWidth * (bandit.health / bandit.maxHealth), healthBarHeight);
    });
    
    // Draw projectiles
    currentState.projectiles.forEach(projectile => {
      // Draw projectile glow for critical hits
      if (projectile.isCritical) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(projectile.position.x, projectile.position.y, projectile.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      // Draw projectile
      ctx.fillStyle = projectile.isCritical ? '#ff0' : '#fff';
      ctx.beginPath();
      ctx.arc(projectile.position.x, projectile.position.y, projectile.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw projectile trail
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = projectile.isCritical ? '#ff0' : '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        projectile.position.x - projectile.velocity.x * 3,
        projectile.position.y - projectile.velocity.y * 3
      );
      ctx.lineTo(projectile.position.x, projectile.position.y);
      ctx.stroke();
      ctx.restore();
    });
    
    // Draw power-ups
    currentState.powerUps.forEach(powerUp => {
      // Draw power-up glow
      ctx.save();
      ctx.globalAlpha = 0.3 + 0.2 * Math.sin(Date.now() / 300);
      
      let glowColor = '#fff';
      switch (powerUp.type) {
        case 'health':
          glowColor = '#f00';
          break;
        case 'speed':
          glowColor = '#0f0';
          break;
        case 'damage':
          glowColor = '#ff0';
          break;
        case 'invincible':
          glowColor = '#0ff';
          break;
        case 'magnet':
          glowColor = '#f0f';
          break;
      }
      
      ctx.fillStyle = glowColor;
      ctx.beginPath();
      ctx.arc(powerUp.position.x, powerUp.position.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Draw power-up
      let color = '#fff';
      switch (powerUp.type) {
        case 'health':
          color = '#f00';
          break;
        case 'speed':
          color = '#0f0';
          break;
        case 'damage':
          color = '#ff0';
          break;
        case 'invincible':
          color = '#0ff';
          break;
        case 'magnet':
          color = '#f0f';
          break;
      }
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(powerUp.position.x, powerUp.position.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw power-up border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(powerUp.position.x, powerUp.position.y, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw icon
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let icon = '';
      switch (powerUp.type) {
        case 'health':
          icon = '❤️';
          break;
        case 'speed':
          icon = '⚡';
          break;
        case 'damage':
          icon = '🔥';
          break;
        case 'invincible':
          icon = '🛡️';
          break;
        case 'magnet':
          icon = '🧲';
          break;
      }
      
      ctx.fillText(icon, powerUp.position.x, powerUp.position.y);
    });
    
    // Draw player
    // Draw player glow when invincible
    if (currentState.playerInvincible) {
      ctx.save();
      ctx.globalAlpha = 0.3 + 0.2 * Math.sin(Date.now() / 100);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(currentState.playerPosition.x, currentState.playerPosition.y, currentState.playerSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Draw player
    ctx.fillStyle = '#4a9';
    ctx.beginPath();
    ctx.arc(currentState.playerPosition.x, currentState.playerPosition.y, currentState.playerSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw player border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(currentState.playerPosition.x, currentState.playerPosition.y, currentState.playerSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw player face
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(currentState.playerPosition.x - 5, currentState.playerPosition.y - 5, 3, 0, Math.PI * 2); // Left eye
    ctx.fill();
    ctx.beginPath();
    ctx.arc(currentState.playerPosition.x + 5, currentState.playerPosition.y - 5, 3, 0, Math.PI * 2); // Right eye
    ctx.fill();
    ctx.beginPath();
    ctx.arc(currentState.playerPosition.x, currentState.playerPosition.y + 5, 5, 0, Math.PI, false); // Smile
    ctx.stroke();
    
    // Draw aim direction
    ctx.save();
    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(currentState.playerPosition.x, currentState.playerPosition.y);
    ctx.lineTo(
      currentState.playerPosition.x + currentState.aimDirection.x * 50,
      currentState.playerPosition.y + currentState.aimDirection.y * 50
    );
    ctx.stroke();
    ctx.restore();
    
    // Draw shooting indicator if shooting
    if (shootingRef.current) {
      ctx.strokeStyle = '#ff0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(currentState.playerPosition.x, currentState.playerPosition.y, currentState.playerSize + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw combo indicator
    if (currentState.comboCount > 0) {
      ctx.fillStyle = '#ff0';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${currentState.comboCount}x Combo!`, currentState.playerPosition.x, currentState.playerPosition.y - 30);
      
      // Draw combo timer
      const comboPercentage = currentState.comboTimer / 3000;
      ctx.fillStyle = '#333';
      ctx.fillRect(currentState.playerPosition.x - 20, currentState.playerPosition.y - 40, 40, 5);
      ctx.fillStyle = '#ff0';
      ctx.fillRect(currentState.playerPosition.x - 20, currentState.playerPosition.y - 40, 40 * comboPercentage, 5);
    }
    
    // Draw floating texts
    floatingTexts.forEach(text => {
      ctx.save();
      ctx.globalAlpha = text.timeLeft / 1500; // Fade out as time decreases
      ctx.fillStyle = text.color;
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.text, text.position.x, text.position.y);
      ctx.restore();
    });
    
    // Draw active power-ups
    const activePowerUps = currentState.powerUps.filter(p => p.duration > 0 && p.timeLeft > 0);
    activePowerUps.forEach((powerUp, index) => {
      const x = 10;
      const y = 120 + index * 30;
      
      ctx.fillStyle = '#333';
      ctx.fillRect(x, y, 150, 25);
      
      let color = '#fff';
      switch (powerUp.type) {
        case 'health':
          color = '#f00';
          break;
        case 'speed':
          color = '#0f0';
          break;
        case 'damage':
          color = '#ff0';
          break;
        case 'invincible':
          color = '#0ff';
          break;
        case 'magnet':
          color = '#f0f';
          break;
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 150 * (powerUp.timeLeft / powerUp.duration), 25);
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(powerUp.name, x + 5, y + 12);
    });
    
    // Draw HUD
    // Health bar
    ctx.fillStyle = '#333';
    ctx.fillRect(10, 10, 200, 20);
    
    // Health gradient
    const healthGradient = ctx.createLinearGradient(10, 10, 210, 10);
    healthGradient.addColorStop(0, '#f00');
    healthGradient.addColorStop(0.5, '#ff0');
    healthGradient.addColorStop(1, '#0f0');
    
    ctx.fillStyle = healthGradient;
    ctx.fillRect(10, 10, 200 * (currentState.health / currentState.maxHealth), 20);
    
    // Health text
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Health: ${Math.ceil(currentState.health)}/${currentState.maxHealth}`, 110, 20);
    
    // Level
    ctx.fillStyle = '#333';
    ctx.fillRect(10, 40, 200, 20);
    
    // Level progress gradient
    const levelGradient = ctx.createLinearGradient(10, 40, 210, 40);
    levelGradient.addColorStop(0, '#0f0');
    levelGradient.addColorStop(1, '#0ff');
    
    ctx.fillStyle = levelGradient;
    ctx.fillRect(10, 40, 200 * ((currentState.score % 1000) / 1000), 20);
    
    // Level text
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Level: ${currentState.level} (${currentState.score % 1000}/1000)`, 110, 50);
    
    // Tokens
    ctx.fillStyle = '#ff0';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Tokens: ${currentState.tokens}`, 10, 80);
    
    // Score
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Score: ${currentState.score}`, CANVAS_WIDTH - 10, 20);
    
    // Shoot cooldown indicator
    if (currentState.shootCooldown > 0) {
      const cooldownPercentage = currentState.shootCooldown / 300;
      ctx.fillStyle = '#333';
      ctx.fillRect(CANVAS_WIDTH - 110, 40, 100, 10);
      ctx.fillStyle = '#f00';
      ctx.fillRect(CANVAS_WIDTH - 110, 40, 100 * (1 - cooldownPercentage), 10);
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('Shoot Ready:', CANVAS_WIDTH - 115, 45);
    } else {
      ctx.fillStyle = '#0f0';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('Shoot Ready!', CANVAS_WIDTH - 10, 45);
    }
  };

  // Upgrade a stat
  const upgradeStats = (upgradeId: string) => {
    const currentState = gameStateRef.current;
    
    const upgrade = currentState.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;
    
    const cost = Math.round(upgrade.cost * Math.pow(1.5, upgrade.level - 1));
    
    if (currentState.tokens >= cost && upgrade.level < upgrade.maxLevel) {
      const newLevel = upgrade.level + 1;
      const newEffect = upgrade.getEffect(newLevel);
      
      // Apply upgrade
      setGameState(prev => {
        const newState = { ...prev };
        
        // Update tokens
        newState.tokens -= cost;
        
        // Update upgrade level
        newState.upgrades = prev.upgrades.map(u => 
          u.id === upgradeId ? { ...u, level: newLevel } : u
        );
        
        // Apply effect
        switch (upgradeId) {
          case 'mining_power':
            newState.miningPower = newEffect;
            newState.projectileDamage = newEffect; // Update projectile damage too
            break;
          case 'health':
            newState.maxHealth = newEffect;
            newState.health = Math.min(newState.health + 25, newEffect); // Heal a bit on upgrade
            break;
          case 'defense':
            newState.defense = newEffect;
            break;
          case 'speed':
            newState.speed = newEffect;
            break;
          case 'critical_chance':
            newState.criticalChance = newEffect;
            break;
          case 'critical_multiplier':
            newState.criticalMultiplier = newEffect;
            break;
          case 'mining_speed':
            newState.miningSpeed = newEffect;
            newState.projectileSpeed = 8 + (newEffect - 1) * 0.5; // Update projectile speed too
            break;
        }
        
        return newState;
      });
      
      // Show upgrade notification
      addFloatingText(`${upgrade.name} upgraded to level ${newLevel}!`, { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }, '#0ff');
    }
  };

  // End game and update stats
  const endGame = () => {
    const currentState = gameStateRef.current;
    
    // Update game stats
    updateGameStats({
      miningStats: {
        gamesPlayed: gameStats.miningStats.gamesPlayed + 1,
        tokensEarned: gameStats.miningStats.tokensEarned + currentState.tokensEarned,
        highestLevel: Math.max(gameStats.miningStats.highestLevel, currentState.level),
        banditsDefeated: gameStats.miningStats.banditsDefeated + currentState.totalBanditsDefeated,
        nodesMined: gameStats.miningStats.nodesMined + currentState.totalNodesMined
      },
      totalTokens: gameStats.totalTokens + currentState.tokensEarned
    });
    
    // Reset game state
    setGameState({
      ...initialGameState,
      screen: 'gameover'
    });
    
    // Stop game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  // Event handlers
  useEffect(() => {
    // Key down handler
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      
      // Space to shoot
      if (e.key === ' ' || e.code === 'Space') {
        shootingRef.current = true;
      }
      
      // Escape to pause
      if (e.key === 'Escape') {
        setGameState(prev => ({
          ...prev,
          paused: !prev.paused
        }));
      }
    };
    
    // Key up handler
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
      
      // Space to stop shooting
      if (e.key === ' ' || e.code === 'Space') {
        shootingRef.current = false;
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start game loop
    if (gameState.screen === 'game' && !gameLoopRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.screen]);

  // End game when game over
  useEffect(() => {
    if (gameState.gameOver) {
      endGame();
    }
  }, [gameState.gameOver]);

  // Render menu screen
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mb-8">
        <Pickaxe className="w-12 h-12 text-amber-500" />
      </div>
      
      <h1 className="text-4xl font-bold mb-4">Mining Mayhem</h1>
      <p className="text-white/60 text-center max-w-md mb-8">
        Mine tokens while defending against bandits!
      </p>

      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={startGame}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors font-medium"
        >
          Start Mining
        </button>
        
        <div className="text-center">
          <div className="text-sm text-white/60">Your Tokens</div>
          <div className="text-2xl font-bold">{gameStats.miningStats.tokensEarned}</div>
        </div>
      </div>
    </div>
  );

  // Render game screen
  const renderGame = () => (
    <div className="relative h-full flex flex-col items-center justify-center">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white/10 rounded-lg shadow-lg"
      />
      
      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        <div className="flex flex-col items-center">
          <button
            onMouseDown={() => keysRef.current.add('ArrowUp')}
            onMouseUp={() => keysRef.current.delete('ArrowUp')}
            onTouchStart={() => keysRef.current.add('ArrowUp')}
            onTouchEnd={() => keysRef.current.delete('ArrowUp')}
            className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div className="flex gap-4 my-1">
            <button
              onMouseDown={() => keysRef.current.add('ArrowLeft')}
              onMouseUp={() => keysRef.current.delete('ArrowLeft')}
              onTouchStart={() => keysRef.current.add('ArrowLeft')}
              onTouchEnd={() => keysRef.current.delete('ArrowLeft')}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onMouseDown={() => keysRef.current.add('ArrowDown')}
              onMouseUp={() => keysRef.current.delete('ArrowDown')}
              onTouchStart={() => keysRef.current.add('ArrowDown')}
              onTouchEnd={() => keysRef.current.delete('ArrowDown')}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <button
              onMouseDown={() => keysRef.current.add('ArrowRight')}
              onMouseUp={() => keysRef.current.delete('ArrowRight')}
              onTouchStart={() => keysRef.current.add('ArrowRight')}
              onTouchEnd={() => keysRef.current.delete('ArrowRight')}
              className="p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <button
          onMouseDown={() => { shootingRef.current = true; }}
          onMouseUp={() => { shootingRef.current = false; }}
          onTouchStart={() => { shootingRef.current = true; }}
          onTouchEnd={() => { shootingRef.current = false; }}
          className={`p-3 rounded-lg transition-colors ${
            gameState.shootCooldown > 0 
              ? 'bg-amber-500/50 cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
          }`}
          disabled={gameState.shootCooldown > 0}
        >
          <Pickaxe className="w-6 h-6" />
        </button>
      </div>
      
      {/* Pause Button */}
      <button
        onClick={() => setGameState(prev => ({ ...prev, paused: !prev.paused }))}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        {gameState.paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
      </button>
      
      {/* Upgrade Button */}
      <button
        onClick={() => setGameState(prev => ({ ...prev, screen: 'upgrade', paused: true }))}
        className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>
      
      {/* Upgrade Notification */}
      {showUpgradeNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-amber-500/80 px-4 py-2 rounded-lg animate-bounce">
          <div className="flex items-center gap-2">
            <ChevronUp className="w-5 h-5" />
            <span>Upgrades Available!</span>
          </div>
        </div>
      )}
      
      {/* Controls Help */}
      {showControls && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold mb-4">Controls</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-20 text-right">WASD or Arrows</div>
              <div className="w-4 text-center">-</div>
              <div>Move</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 text-right">Space</div>
              <div className="w-4 text-center">-</div>
              <div>Shoot</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 text-right">Escape</div>
              <div className="w-4 text-center">-</div>
              <div>Pause</div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-white/60">
            Click anywhere to dismiss
          </div>
        </div>
      )}
      
      {/* Pause Menu */}
      {gameState.paused && gameState.screen === 'game' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Game Paused</h3>
            <div className="space-y-4">
              <button
                onClick={() => setGameState(prev => ({ ...prev, paused: false }))}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
              >
                Resume
              </button>
              <button
                onClick={() => setGameState(prev => ({ ...prev, screen: 'upgrade' }))}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Upgrades
              </button>
              <button
                onClick={() => {
                  setGameState({
                    ...initialGameState,
                    screen: 'menu'
                  });
                  
                  if (gameLoopRef.current) {
                    cancelAnimationFrame(gameLoopRef.current);
                    gameLoopRef.current = null;
                  }
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render upgrade screen
  const renderUpgrade = () => (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Upgrades</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="text-xl font-bold">{gameState.tokens}</span>
          </div>
          <button
            onClick={() => setGameState(prev => ({ ...prev, screen: 'game', paused: false }))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gameState.upgrades.map(upgrade => {
          const cost = Math.round(upgrade.cost * Math.pow(1.5, upgrade.level - 1));
          const canUpgrade = gameState.tokens >= cost && upgrade.level < upgrade.maxLevel;
          
          return (
            <div
              key={upgrade.id}
              className={`p-4 rounded-xl border transition-colors ${
                canUpgrade 
                  ? 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer' 
                  : 'border-white/10 bg-white/5'
              }`}
              onClick={() => canUpgrade && upgradeStats(upgrade.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  {upgrade.icon}
                </div>
                <div>
                  <div className="font-medium">{upgrade.name}</div>
                  <div className="text-sm text-white/60">{upgrade.description}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Level:</span>
                  <span className="font-medium">{upgrade.level}/{upgrade.maxLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Cost:</span>
                  <span className={`font-medium ${canUpgrade ? 'text-amber-400' : 'text-white/40'}`}>
                    {cost}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/60">Effect:</span>
                  <span>{upgrade.getEffect(upgrade.level)}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${(upgrade.level / upgrade.maxLevel) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render game over screen
  const renderGameOver = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-8">
        <Skull className="w-12 h-12 text-red-500" />
      </div>
      
      <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
      <p className="text-white/60 mb-8">{gameState.gameOverReason || "You were defeated!"}</p>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{gameState.level}</div>
          <div className="text-sm text-white/60">Level Reached</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{gameState.tokensEarned}</div>
          <div className="text-sm text-white/60">Tokens Earned</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">{gameState.totalNodesMined}</div>
          <div className="text-sm text-white/60">Nodes Mined</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">{gameState.totalBanditsDefeated}</div>
          <div className="text-sm text-white/60">Bandits Defeated</div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => setGameState({ ...initialGameState, screen: 'menu' })}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
        >
          Main Menu
        </button>
        <button
          onClick={startGame}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {gameState.screen === 'menu' && renderMenu()}
      {gameState.screen === 'game' && renderGame()}
      {gameState.screen === 'upgrade' && renderUpgrade()}
      {gameState.screen === 'gameover' && renderGameOver()}
    </div>
  );
};