import React, { useState, useEffect } from 'react';
import { 
  Swords, Shield, Zap, X, Info, Flame, Star, Gift, 
  Sparkles, Skull, Heart, Trophy, ArrowRight 
} from 'lucide-react';
import { Character, GameState, Action, BattleLog, PowerUp, StatusEffect } from '../../types/memeArena';
import { CharacterSelect } from './MemeArenaCharacterSelect';
import { BattleArena } from './MemeArenaBattle';
import { characters } from '../../data/memeArenaCharacters';
import { useStore } from '../../store/useStore';

export const MemeArena: React.FC = () => {
  const { updateGameStats, gameStats } = useStore();
  const [state, setState] = useState<GameState>({
    screen: 'character-select',
    playerCharacter: null,
    aiCharacter: null,
    playerHP: 100,
    playerMaxHP: 100,
    playerMP: 100,
    playerMaxMP: 100,
    aiHP: 100,
    aiMaxHP: 100,
    aiMP: 100,
    aiMaxMP: 100,
    turn: 'player',
    battleLogs: [],
    tokens: 0,
    isGameOver: false,
    combo: 0,
    comboMultiplier: 1,
    lastAction: null,
    criticalHit: false,
    powerUps: [],
    availablePowerUps: [],
    playerStatusEffects: [],
    aiStatusEffects: [],
    battleTurn: 1,
    playerConsecutiveDefends: 0,
    aiConsecutiveDefends: 0,
    playerUltimateCharge: 0,
    aiUltimateCharge: 0
  });

  const selectCharacter = (character: Character) => {
    // Randomly select AI character (different from player's choice)
    const availableOpponents = characters.filter(c => c.id !== character.id);
    const aiCharacter = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];

    // Calculate max HP and MP based on character stats
    const playerMaxHP = 100 + (character.stats.defense * 5);
    const playerMaxMP = 100 + (character.stats.speed * 3);
    const aiMaxHP = 100 + (aiCharacter.stats.defense * 5);
    const aiMaxMP = 100 + (aiCharacter.stats.speed * 3);

    // Generate initial power-ups
    const initialPowerUps = generatePowerUps(2);

    setState(prev => ({
      ...prev,
      screen: 'battle',
      playerCharacter: character,
      aiCharacter,
      playerHP: playerMaxHP,
      playerMaxHP,
      playerMP: playerMaxMP,
      playerMaxMP,
      aiHP: aiMaxHP,
      aiMaxHP,
      aiMP: aiMaxMP,
      aiMaxMP,
      availablePowerUps: initialPowerUps,
      battleLogs: [
        { type: 'BATTLE_START', text: `Battle starts between ${character.name} and ${aiCharacter.name}!` }
      ]
    }));
  };

  // Generate random power-ups
  const generatePowerUps = (count: number): PowerUp[] => {
    const possiblePowerUps: PowerUp[] = [
      { 
        id: 'attack_boost', 
        name: 'Attack Boost', 
        description: 'Increases attack by 30% for 3 turns', 
        duration: 3, 
        effect: { type: 'ATTACK_BOOST', value: 0.3 }, 
        icon: Flame 
      },
      { 
        id: 'defense_boost', 
        name: 'Defense Boost', 
        description: 'Increases defense by 30% for 3 turns', 
        duration: 3, 
        effect: { type: 'DEFENSE_BOOST', value: 0.3 }, 
        icon: Shield 
      },
      { 
        id: 'speed_boost', 
        name: 'Speed Boost', 
        description: 'Increases speed by 30% for 3 turns', 
        duration: 3, 
        effect: { type: 'SPEED_BOOST', value: 0.3 }, 
        icon: Zap 
      },
      { 
        id: 'critical_boost', 
        name: 'Critical Boost', 
        description: 'Increases critical hit chance by 20% for 3 turns', 
        duration: 3, 
        effect: { type: 'CRITICAL_BOOST', value: 0.2 }, 
        icon: Star 
      },
      { 
        id: 'healing', 
        name: 'Healing', 
        description: 'Restores 30 HP immediately', 
        duration: 0, 
        effect: { type: 'HEALING', value: 30 }, 
        icon: Heart 
      },
      { 
        id: 'mana_restore', 
        name: 'Mana Restore', 
        description: 'Restores 40 MP immediately', 
        duration: 0, 
        effect: { type: 'MANA_RESTORE', value: 40 }, 
        icon: Sparkles 
      },
      { 
        id: 'combo_extender', 
        name: 'Combo Extender', 
        description: 'Extends combo duration by 2 turns', 
        duration: 2, 
        effect: { type: 'COMBO_EXTENDER', value: 2 }, 
        icon: Gift 
      }
    ];

    // Shuffle and pick random power-ups
    return [...possiblePowerUps]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  };

  // Apply status effects to get modified stats
  const getModifiedStats = (character: Character, statusEffects: StatusEffect[]) => {
    let attack = character.stats.attack;
    let defense = character.stats.defense;
    let speed = character.stats.speed;
    let criticalChance = 0.1 + (character.stats.speed / 100);

    statusEffects.forEach(effect => {
      switch (effect.effect.type) {
        case 'ATTACK_BOOST':
          attack += character.stats.attack * effect.effect.value;
          break;
        case 'DEFENSE_BOOST':
          defense += character.stats.defense * effect.effect.value;
          break;
        case 'SPEED_BOOST':
          speed += character.stats.speed * effect.effect.value;
          break;
        case 'CRITICAL_BOOST':
          criticalChance += effect.effect.value;
          break;
      }
    });

    return { attack, defense, speed, criticalChance };
  };

  const getSpecialAbilityDamage = (character: Character) => {
    switch (character.id) {
      case 'doge':
        return { damage: 35, name: 'Much Wow Blast', mpCost: 40, description: 'A powerful blast of meme energy' };
      case 'pepe':
        return { damage: 40, name: 'Rare Pepe Magic', mpCost: 40, description: 'Summons the rarest Pepe for massive damage' };
      case 'shib':
        return { damage: 45, name: 'Critical Bonk', mpCost: 40, description: 'Bonks the opponent with critical force' };
      case 'trump':
        return { damage: 50, name: 'Presidential Power', mpCost: 40, description: 'Uses executive authority for a powerful attack' };
      default:
        return { damage: 30, name: 'Special Attack', mpCost: 40, description: 'A powerful special attack' };
    }
  };

  const getUltimateAbility = (character: Character) => {
    switch (character.id) {
      case 'doge':
        return { 
          damage: 70, 
          name: 'To The Moon', 
          description: 'Channels the power of the entire Dogecoin community',
          effect: { type: 'ATTACK_BOOST', value: 0.5, duration: 2 }
        };
      case 'pepe':
        return { 
          damage: 80, 
          name: 'Meme Singularity', 
          description: 'Creates a singularity of pure meme energy',
          effect: { type: 'DEFENSE_BOOST', value: 0.5, duration: 2 }
        };
      case 'shib':
        return { 
          damage: 75, 
          name: 'Shiba Army', 
          description: 'Summons the entire Shiba army for a devastating attack',
          effect: { type: 'SPEED_BOOST', value: 0.5, duration: 2 }
        };
      case 'trump':
        return { 
          damage: 90, 
          name: 'Make Crypto Great Again', 
          description: 'The ultimate presidential decree',
          effect: { type: 'CRITICAL_BOOST', value: 0.3, duration: 2 }
        };
      default:
        return { 
          damage: 60, 
          name: 'Ultimate Attack', 
          description: 'The ultimate attack',
          effect: { type: 'ATTACK_BOOST', value: 0.4, duration: 2 }
        };
    }
  };

  const calculateDamage = (attacker: Character, defender: Character, attackType: 'quick' | 'heavy' | 'special' | 'ultimate', state: GameState, isPlayer: boolean) => {
    const attackerStatusEffects = isPlayer ? state.playerStatusEffects : state.aiStatusEffects;
    const defenderStatusEffects = isPlayer ? state.aiStatusEffects : state.playerStatusEffects;
    
    const { attack: modifiedAttack, speed: modifiedSpeed, criticalChance } = getModifiedStats(attacker, attackerStatusEffects);
    const { defense: modifiedDefense } = getModifiedStats(defender, defenderStatusEffects);

    let baseDamage;
    if (attackType === 'quick') {
      baseDamage = 10;
    } else if (attackType === 'heavy') {
      baseDamage = 20;
    } else if (attackType === 'special') {
      baseDamage = getSpecialAbilityDamage(attacker).damage;
    } else { // ultimate
      baseDamage = getUltimateAbility(attacker).damage;
    }

    const attackMultiplier = modifiedAttack / 10;
    const defenseMultiplier = modifiedDefense / 10;
    const speedBonus = modifiedSpeed / 20; // Speed affects damage
    const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2

    // Combo system
    const comboMultiplier = isPlayer ? state.comboMultiplier : 1;

    // Critical hit system (base chance increased by speed)
    const isCritical = Math.random() < criticalChance;
    const criticalMultiplier = isCritical ? 1.5 : 1;

    // Calculate final damage
    const finalDamage = Math.round(
      baseDamage * 
      attackMultiplier * 
      (1 - defenseMultiplier * 0.5) * 
      (1 + speedBonus) * 
      randomFactor * 
      comboMultiplier *
      criticalMultiplier
    );

    return { damage: finalDamage, isCritical };
  };

  const handleAction = (action: Action) => {
    if (state.isGameOver || !state.playerCharacter || !state.aiCharacter) return;

    const newState = { ...state };
    let damage = 0;
    let isCritical = false;
    let powerUpUsed = false;

    // Player's turn
    if (state.turn === 'player') {
      // Handle power-up usage
      if (action.type === 'USE_POWER_UP' && action.powerUpId) {
        const powerUp = state.availablePowerUps.find(p => p.id === action.powerUpId);
        if (powerUp) {
          // Apply power-up effect
          const statusEffect: StatusEffect = {
            id: `${powerUp.id}-${Date.now()}`,
            name: powerUp.name,
            duration: powerUp.duration,
            timeLeft: powerUp.duration,
            effect: powerUp.effect
          };
          
          // Apply immediate effects
          if (powerUp.effect.type === 'HEALING') {
            newState.playerHP = Math.min(newState.playerMaxHP, newState.playerHP + powerUp.effect.value);
            newState.battleLogs = [
              ...state.battleLogs,
              { 
                type: 'POWER_UP', 
                text: `${state.playerCharacter.name} used ${powerUp.name} and healed for ${powerUp.effect.value} HP!`
              }
            ];
          } else if (powerUp.effect.type === 'MANA_RESTORE') {
            newState.playerMP = Math.min(newState.playerMaxMP, newState.playerMP + powerUp.effect.value);
            newState.battleLogs = [
              ...state.battleLogs,
              { 
                type: 'POWER_UP', 
                text: `${state.playerCharacter.name} used ${powerUp.name} and restored ${powerUp.effect.value} MP!`
              }
            ];
          } else {
            // Add status effect
            newState.playerStatusEffects = [
              ...state.playerStatusEffects,
              statusEffect
            ];
            newState.battleLogs = [
              ...state.battleLogs,
              { 
                type: 'POWER_UP', 
                text: `${state.playerCharacter.name} used ${powerUp.name}!`
              }
            ];
          }
          
          // Remove power-up from available list
          newState.availablePowerUps = state.availablePowerUps.filter(p => p.id !== powerUp.id);
          
          powerUpUsed = true;
          newState.turn = 'ai';
          
          // Schedule AI turn
          setTimeout(() => handleAITurn(), 1500);
        }
      }
      // Handle ultimate attack
      else if (action.type === 'ULTIMATE' && state.playerUltimateCharge >= 100) {
        const ultimateAbility = getUltimateAbility(state.playerCharacter);
        const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'ultimate', newState, true);
        damage = result.damage;
        isCritical = result.isCritical;
        
        newState.aiHP = Math.max(0, state.aiHP - damage);
        newState.playerUltimateCharge = 0;
        
        // Add status effect from ultimate
        const statusEffect: StatusEffect = {
          id: `ultimate-${Date.now()}`,
          name: ultimateAbility.name,
          duration: ultimateAbility.effect.duration * 1000,
          timeLeft: ultimateAbility.effect.duration * 1000,
          effect: {
            type: ultimateAbility.effect.type,
            value: ultimateAbility.effect.value
          }
        };
        
        newState.playerStatusEffects = [
          ...state.playerStatusEffects,
          statusEffect
        ];
        
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'ULTIMATE', 
            text: `${state.playerCharacter.name} unleashed ${ultimateAbility.name} and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
        
        // Check if AI is defeated
        if (newState.aiHP <= 0) {
          const baseReward = 100;
          const comboBonus = newState.combo * 20;
          const levelBonus = Math.round(baseReward * 0.1 * newState.battleTurn);
          const finalReward = baseReward + comboBonus + levelBonus;
          
          newState.isGameOver = true;
          newState.tokens += finalReward;
          newState.battleLogs = [
            ...newState.battleLogs,
            { 
              type: 'GAME_OVER', 
              text: `${state.playerCharacter.name} wins! You earned ${finalReward} tokens!${
                comboBonus > 0 ? ` (${comboBonus} bonus from ${newState.combo}x combo!)` : ''
              }${
                levelBonus > 0 ? ` (${levelBonus} bonus from battle length!)` : ''
              }`
            }
          ];
          
          // Update game stats
          updateGameStats({
            arenaStats: {
              battlesPlayed: gameStats.arenaStats.battlesPlayed + 1,
              tokensEarned: gameStats.arenaStats.tokensEarned + finalReward,
              wins: gameStats.arenaStats.wins + 1,
              winRate: Math.round(((gameStats.arenaStats.wins + 1) / (gameStats.arenaStats.battlesPlayed + 1)) * 100),
              bestStreak: Math.max(gameStats.arenaStats.bestStreak, 1) // Increment streak logic would go here
            },
            totalTokens: gameStats.totalTokens + finalReward
          });
        } else {
          newState.turn = 'ai';
          // Schedule AI turn
          setTimeout(() => handleAITurn(), 1500);
        }
      }
      // Handle regular attacks
      else if (!powerUpUsed) {
        // Update combo based on action type
        if (state.lastAction === action.type) {
          newState.combo = Math.min(state.combo + 1, 5); // Max 5 combo
        } else {
          newState.combo = 0;
        }
        newState.lastAction = action.type;
        newState.comboMultiplier = 1 + (newState.combo * 0.1);

        switch (action.type) {
          case 'QUICK_ATTACK': {
            const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'quick', newState, true);
            damage = result.damage;
            isCritical = result.isCritical;
            newState.aiHP = Math.max(0, state.aiHP - damage);
            newState.playerUltimateCharge = Math.min(100, state.playerUltimateCharge + 10);
            newState.battleLogs = [
              ...state.battleLogs,
              { 
                type: 'PLAYER_ATTACK', 
                text: `${state.playerCharacter.name} used Quick Attack and dealt ${damage} damage!${
                  isCritical ? ' CRITICAL HIT!' : ''
                }${newState.combo > 0 ? ` ${newState.combo}x COMBO!` : ''}`
              }
            ];
            break;
          }

          case 'HEAVY_ATTACK': {
            const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'heavy', newState, true);
            damage = result.damage;
            isCritical = result.isCritical;
            newState.aiHP = Math.max(0, state.aiHP - damage);
            newState.playerUltimateCharge = Math.min(100, state.playerUltimateCharge + 15);
            newState.battleLogs = [
              ...state.battleLogs,
              { 
                type: 'PLAYER_ATTACK', 
                text: `${state.playerCharacter.name} used Heavy Attack and dealt ${damage} damage!${
                  isCritical ? ' CRITICAL HIT!' : ''
                }${newState.combo > 0 ? ` ${newState.combo}x COMBO!` : ''}`
              }
            ];
            break;
          }

          case 'SPECIAL_ATTACK': {
            if (state.playerMP >= 40) {
              const specialAbility = getSpecialAbilityDamage(state.playerCharacter);
              const result = calculateDamage(state.playerCharacter, state.aiCharacter, 'special', newState, true);
              damage = result.damage;
              isCritical = result.isCritical;
              newState.aiHP = Math.max(0, state.aiHP - damage);
              newState.playerMP -= specialAbility.mpCost;
              newState.playerUltimateCharge = Math.min(100, state.playerUltimateCharge + 25);
              newState.battleLogs = [
                ...state.battleLogs,
                { 
                  type: 'PLAYER_ATTACK', 
                  text: `${state.playerCharacter.name} used ${specialAbility.name} and dealt ${damage} damage!${
                    isCritical ? ' CRITICAL HIT!' : ''
                  }${newState.combo > 0 ? ` ${newState.combo}x COMBO!` : ''}`
                }
              ];
            }
            break;
          }

          case 'DEFEND':
            newState.playerMP = Math.min(state.playerMaxMP, state.playerMP + 20);
            newState.playerUltimateCharge = Math.min(100, state.playerUltimateCharge + 5);
            newState.playerConsecutiveDefends++;
            
            // Bonus MP for consecutive defends
            if (newState.playerConsecutiveDefends > 1) {
              const bonusMP = 10 * newState.playerConsecutiveDefends;
              newState.playerMP = Math.min(state.playerMaxMP, newState.playerMP + bonusMP);
              newState.battleLogs = [
                ...state.battleLogs,
                { 
                  type: 'PLAYER_DEFEND', 
                  text: `${state.playerCharacter.name} took a defensive stance and recovered 20 MP + ${bonusMP} bonus MP!`
                }
              ];
            } else {
              newState.battleLogs = [
                ...state.battleLogs,
                { 
                  type: 'PLAYER_DEFEND', 
                  text: `${state.playerCharacter.name} took a defensive stance and recovered 20 MP!`
                }
              ];
            }
            break;
        }

        // Check if AI is defeated
        if (newState.aiHP <= 0) {
          const baseReward = 100;
          const comboBonus = newState.combo * 20;
          const levelBonus = Math.round(baseReward * 0.1 * newState.battleTurn);
          const finalReward = baseReward + comboBonus + levelBonus;
          
          newState.isGameOver = true;
          newState.tokens += finalReward;
          newState.battleLogs = [
            ...newState.battleLogs,
            { 
              type: 'GAME_OVER', 
              text: `${state.playerCharacter.name} wins! You earned ${finalReward} tokens!${
                comboBonus > 0 ? ` (${comboBonus} bonus from ${newState.combo}x combo!)` : ''
              }${
                levelBonus > 0 ? ` (${levelBonus} bonus from battle length!)` : ''
              }`
            }
          ];
          
          // Update game stats
          updateGameStats({
            arenaStats: {
              battlesPlayed: gameStats.arenaStats.battlesPlayed + 1,
              tokensEarned: gameStats.arenaStats.tokensEarned + finalReward,
              wins: gameStats.arenaStats.wins + 1,
              winRate: Math.round(((gameStats.arenaStats.wins + 1) / (gameStats.arenaStats.battlesPlayed + 1)) * 100),
              bestStreak: Math.max(gameStats.arenaStats.bestStreak, 1) // Increment streak logic would go here
            },
            totalTokens: gameStats.totalTokens + finalReward
          });
        } else {
          newState.turn = 'ai';
          // Schedule AI turn
          setTimeout(() => handleAITurn(), 1500);
        }
      }
    }

    setState(newState);
  };

  const handleAITurn = () => {
    if (!state.playerCharacter || !state.aiCharacter) return;

    const newState = { ...state };
    newState.battleTurn++;
    
    // Update status effects
    newState.playerStatusEffects = newState.playerStatusEffects
      .map(effect => ({
        ...effect,
        timeLeft: effect.timeLeft - 1
      }))
      .filter(effect => effect.timeLeft > 0);
    
    newState.aiStatusEffects = newState.aiStatusEffects
      .map(effect => ({
        ...effect,
        timeLeft: effect.timeLeft - 1
      }))
      .filter(effect => effect.timeLeft > 0);
    
    // AI strategy
    let action: Action['type'] = 'QUICK_ATTACK';
    
    // Use ultimate if available
    if (newState.aiUltimateCharge >= 100 && Math.random() < 0.8) {
      action = 'ULTIMATE';
    }
    // Use special attack if enough MP
    else if (newState.aiMP >= 40 && Math.random() < 0.6) {
      action = 'SPECIAL_ATTACK';
    }
    // Defend if low on MP or HP
    else if ((newState.aiMP < 20 || newState.aiHP < newState.aiMaxHP * 0.3) && Math.random() < 0.7) {
      action = 'DEFEND';
    }
    // Choose between quick and heavy attack
    else {
      action = Math.random() < 0.6 ? 'QUICK_ATTACK' : 'HEAVY_ATTACK';
    }
    
    let damage = 0;
    let isCritical = false;

    switch (action) {
      case 'ULTIMATE': {
        const ultimateAbility = getUltimateAbility(state.aiCharacter);
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'ultimate', newState, false);
        damage = result.damage;
        isCritical = result.isCritical;
        
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.aiUltimateCharge = 0;
        
        // Add status effect from ultimate
        const statusEffect: StatusEffect = {
          id: `ultimate-${Date.now()}`,
          name: ultimateAbility.name,
          duration: ultimateAbility.effect.duration * 1000,
          timeLeft: ultimateAbility.effect.duration * 1000,
          effect: {
            type: ultimateAbility.effect.type,
            value: ultimateAbility.effect.value
          }
        };
        
        newState.aiStatusEffects = [
          ...state.aiStatusEffects,
          statusEffect
        ];
        
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'ULTIMATE', 
            text: `${state.aiCharacter.name} unleashed ${ultimateAbility.name} and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
        break;
      }
      
      case 'QUICK_ATTACK': {
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'quick', newState, false);
        damage = result.damage;
        isCritical = result.isCritical;
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.aiUltimateCharge = Math.min(100, state.aiUltimateCharge + 10);
        newState.aiConsecutiveDefends = 0;
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'AI_ATTACK', 
            text: `${state.aiCharacter.name} used Quick Attack and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
        break;
      }

      case 'HEAVY_ATTACK': {
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'heavy', newState, false);
        damage = result.damage;
        isCritical = result.isCritical;
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.aiUltimateCharge = Math.min(100, state.aiUltimateCharge + 15);
        newState.aiConsecutiveDefends = 0;
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'AI_ATTACK', 
            text: `${state.aiCharacter.name} used Heavy Attack and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
        break;
      }

      case 'SPECIAL_ATTACK': {
        const specialAbility = getSpecialAbilityDamage(state.aiCharacter);
        const result = calculateDamage(state.aiCharacter, state.playerCharacter, 'special', newState, false);
        damage = result.damage;
        isCritical = result.isCritical;
        newState.playerHP = Math.max(0, state.playerHP - damage);
        newState.aiMP -= specialAbility.mpCost;
        newState.aiUltimateCharge = Math.min(100, state.aiUltimateCharge + 25);
        newState.aiConsecutiveDefends = 0;
        newState.battleLogs = [
          ...state.battleLogs,
          { 
            type: 'AI_ATTACK', 
            text: `${state.aiCharacter.name} used ${specialAbility.name} and dealt ${damage} damage!${
              isCritical ? ' CRITICAL HIT!' : ''
            }`
          }
        ];
        break;
      }

      case 'DEFEND':
        newState.aiMP = Math.min(state.aiMaxMP, state.aiMP + 20);
        newState.aiUltimateCharge = Math.min(100, state.aiUltimateCharge + 5);
        newState.aiConsecutiveDefends++;
        
        // Bonus MP for consecutive defends
        if (newState.aiConsecutiveDefends > 1) {
          const bonusMP = 10 * newState.aiConsecutiveDefends;
          newState.aiMP = Math.min(state.aiMaxMP, newState.aiMP + bonusMP);
          newState.battleLogs = [
            ...state.battleLogs,
            { 
              type: 'AI_DEFEND', 
              text: `${state.aiCharacter.name} took a defensive stance and recovered 20 MP + ${bonusMP} bonus MP!`
            }
          ];
        } else {
          newState.battleLogs = [
            ...state.battleLogs,
            { 
              type: 'AI_DEFEND', 
              text: `${state.aiCharacter.name} took a defensive stance and recovered 20 MP!`
            }
          ];
        }
        break;
    }

    // Check if player is defeated
    if (newState.playerHP <= 0) {
      newState.isGameOver = true;
      newState.battleLogs = [
        ...newState.battleLogs,
        { type: 'GAME_OVER', text: `${state.aiCharacter.name} wins! Better luck next time!` }
      ];
      
      // Update game stats
      updateGameStats({
        arenaStats: {
          battlesPlayed: gameStats.arenaStats.battlesPlayed + 1,
          tokensEarned: gameStats.arenaStats.tokensEarned,
          wins: gameStats.arenaStats.wins,
          winRate: Math.round((gameStats.arenaStats.wins / (gameStats.arenaStats.battlesPlayed + 1)) * 100),
          bestStreak: gameStats.arenaStats.bestStreak
        }
      });
    } else {
      // Generate new power-up occasionally
      if (newState.battleTurn % 3 === 0 && newState.availablePowerUps.length < 3 && Math.random() < 0.7) {
        const newPowerUps = generatePowerUps(1);
        newState.availablePowerUps = [...newState.availablePowerUps, ...newPowerUps];
        newState.battleLogs = [
          ...newState.battleLogs,
          { 
            type: 'POWER_UP', 
            text: `A new power-up has appeared: ${newPowerUps[0].name}!`
          }
        ];
      }
      
      newState.turn = 'player';
      newState.playerConsecutiveDefends = 0;
    }

    setState(newState);
  };

  const startNewGame = () => {
    setState({
      screen: 'character-select',
      playerCharacter: null,
      aiCharacter: null,
      playerHP: 100,
      playerMaxHP: 100,
      playerMP: 100,
      playerMaxMP: 100,
      aiHP: 100,
      aiMaxHP: 100,
      aiMP: 100,
      aiMaxMP: 100,
      turn: 'player',
      battleLogs: [],
      tokens: 0,
      isGameOver: false,
      combo: 0,
      comboMultiplier: 1,
      lastAction: null,
      criticalHit: false,
      powerUps: [],
      availablePowerUps: [],
      playerStatusEffects: [],
      aiStatusEffects: [],
      battleTurn: 1,
      playerConsecutiveDefends: 0,
      aiConsecutiveDefends: 0,
      playerUltimateCharge: 0,
      aiUltimateCharge: 0
    });
  };

  return (
    <div className="h-full">
      <div className="p-6 h-full">
        {state.screen === 'character-select' ? (
          <CharacterSelect onSelect={selectCharacter} />
        ) : (
          <BattleArena
            state={state}
            onAction={handleAction}
            onNewGame={startNewGame}
          />
        )}
      </div>
    </div>
  );
};