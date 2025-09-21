import { Character } from '../types/memeArena';

export const characters: Character[] = [
  {
    id: 'doge',
    name: 'DOGE',
    description: 'Much wow, very strength! The original memecoin warrior',
    image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    stats: {
      attack: 8,
      defense: 7,
      speed: 5
    }
  },
  {
    id: 'pepe',
    name: 'PEPE',
    description: 'Rare Pepe magic caster with powerful memes',
    image: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    stats: {
      attack: 9,
      defense: 4,
      speed: 7
    }
  },
  {
    id: 'shib',
    name: 'SHIB',
    description: 'Swift and stealthy Shiba with critical bonks',
    image: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
    stats: {
      attack: 7,
      defense: 5,
      speed: 9
    }
  },
  {
    id: 'trump',
    name: 'TRUMP',
    description: 'The Official Trump token with presidential powers',
    image: 'https://assets.coingecko.com/coins/images/53746/standard/trump.png?1737171561',
    stats: {
      attack: 6,
      defense: 9,
      speed: 4
    }
  }
];