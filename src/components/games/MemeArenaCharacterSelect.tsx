import React from 'react';
import { characters } from '../../data/memeArenaCharacters';
import { Character } from '../../types/memeArena';
import { Swords, Shield, Zap, Info } from 'lucide-react';

interface CharacterSelectProps {
  onSelect: (character: Character) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Choose Your Meme Champion</h2>
      
      <div className="grid grid-cols-2 gap-6 max-w-2xl">
        {characters.map(character => (
          <div
            key={character.id}
            className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-all hover:scale-[1.02] border border-white/10 shadow-lg group"
          >
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-24 h-24 rounded-full relative z-10 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{character.name}</h3>
              <p className="text-white/60 text-center text-sm mb-3">{character.description}</p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-red-400" />
                  <span className="text-white/60 text-sm">Attack</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    character.stats.attack >= 8 ? 'bg-red-500/20 text-red-400' :
                    character.stats.attack >= 6 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {character.stats.attack}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-white/60 text-sm">Defense</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    character.stats.defense >= 8 ? 'bg-blue-500/20 text-blue-400' :
                    character.stats.defense >= 6 ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-sky-500/20 text-sky-400'
                  }`}>
                    {character.stats.defense}/10
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/60 text-sm">Speed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    character.stats.speed >= 8 ? 'bg-green-500/20 text-green-400' :
                    character.stats.speed >= 6 ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-teal-500/20 text-teal-400'
                  }`}>
                    {character.stats.speed}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group/tooltip mb-4">
              <div className="flex items-center gap-1 text-xs text-white/60 cursor-help">
                <Info className="w-3 h-3" />
                <span>Special Abilities</span>
              </div>
              <div className="absolute bottom-full left-0 mb-2 w-full p-3 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 invisible group-hover/tooltip:visible z-10 text-xs">
                <div className="font-medium mb-1">Special Attack:</div>
                {character.id === 'doge' && <p>Much Wow Blast: A powerful blast of meme energy</p>}
                {character.id === 'pepe' && <p>Rare Pepe Magic: Summons the rarest Pepe for massive damage</p>}
                {character.id === 'shib' && <p>Critical Bonk: Bonks the opponent with critical force</p>}
                {character.id === 'trump' && <p>Presidential Power: Uses executive authority for a powerful attack</p>}
                
                <div className="font-medium mt-2 mb-1">Ultimate:</div>
                {character.id === 'doge' && <p>To The Moon: Channels the power of the entire Dogecoin community</p>}
                {character.id === 'pepe' && <p>Meme Singularity: Creates a singularity of pure meme energy</p>}
                {character.id === 'shib' && <p>Shiba Army: Summons the entire Shiba army for a devastating attack</p>}
                {character.id === 'trump' && <p>Make Crypto Great Again: The ultimate presidential decree</p>}
              </div>
            </div>

            <button
              onClick={() => onSelect(character)}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-purple-500/20"
            >
              Select {character.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};