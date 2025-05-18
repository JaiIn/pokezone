import { Pokemon, PokemonListResponse, PokemonSpecies } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonService {
  static async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('포켓몬 목록을 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  static async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error('포켓몬 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  static async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    if (!response.ok) {
      throw new Error('포켓몬 종족 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  static async searchPokemon(query: string): Promise<Pokemon | null> {
    try {
      return await this.getPokemon(query.toLowerCase());
    } catch (error) {
      return null;
    }
  }

  static getKoreanName(species: PokemonSpecies): string {
    const koreanName = species.names.find(name => name.language.name === 'ko');
    return koreanName ? koreanName.name : species.name;
  }

  static getKoreanFlavorText(species: PokemonSpecies): string {
    const koreanEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'ko'
    );
    return koreanEntry 
      ? koreanEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
      : '설명을 찾을 수 없습니다.';
  }

  static formatPokemonId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  static getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: 'type-normal',
      fighting: 'type-fighting',
      flying: 'type-flying',
      poison: 'type-poison',
      ground: 'type-ground',
      rock: 'type-rock',
      bug: 'type-bug',
      ghost: 'type-ghost',
      steel: 'type-steel',
      fire: 'type-fire',
      water: 'type-water',
      grass: 'type-grass',
      electric: 'type-electric',
      psychic: 'type-psychic',
      ice: 'type-ice',
      dragon: 'type-dragon',
      dark: 'type-dark',
      fairy: 'type-fairy',
    };
    return typeColors[type] || 'type-normal';
  }

  static getTypeKoreanName(type: string): string {
    const typeNames: { [key: string]: string } = {
      normal: '노말',
      fighting: '격투',
      flying: '비행',
      poison: '독',
      ground: '땅',
      rock: '바위',
      bug: '벌레',
      ghost: '고스트',
      steel: '강철',
      fire: '불꽃',
      water: '물',
      grass: '풀',
      electric: '전기',
      psychic: '에스퍼',
      ice: '얼음',
      dragon: '드래곤',
      dark: '악',
      fairy: '페어리',
    };
    return typeNames[type] || type;
  }

  static getStatKoreanName(stat: string): string {
    const statNames: { [key: string]: string } = {
      hp: 'HP',
      attack: '공격',
      defense: '방어',
      'special-attack': '특수공격',
      'special-defense': '특수방어',
      speed: '스피드',
    };
    return statNames[stat] || stat;
  }
}
