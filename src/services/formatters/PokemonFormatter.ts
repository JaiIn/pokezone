import { Pokemon, PokemonSpecies } from '../../types';
import { FlavorTextEntry } from '../../types/common';
import { Language } from '../../contexts/LanguageContext';
import { TypeFormatter } from './TypeFormatter';
import { AbilityFormatter } from './AbilityFormatter';

export class PokemonFormatter {
  static getDisplayName(pokemon: Pokemon, species?: PokemonSpecies | null, language: Language = 'en'): string {
    console.log('🔍 getDisplayName 호출:', {
      pokemonName: pokemon.name,
      language,
      hasSpecies: !!species,
      speciesNames: species?.names?.length || 0
    });
    
    if (species && species.names) {
      console.log('📋 사용 가능한 언어들:', species.names.map(n => n.language.name));
      
      const localizedName = species.names.find(name => name.language.name === language);
      
      console.log('🎯 찾은 번역 이름:', {
        language,
        found: !!localizedName,
        name: localizedName?.name
      });
      
      if (localizedName) {
        return localizedName.name;
      }
    }
    
    console.log('⬅️ 기본 영어 이름 사용:', pokemon.name);
    return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  }

  static getFlavorText(species: PokemonSpecies, language: Language = 'en'): string {
    // 요청된 언어로 먼저 찾기
    const localizedEntry = species.flavor_text_entries.find(
      (entry: FlavorTextEntry) => entry.language.name === language
    );
    if (localizedEntry) {
      return localizedEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
    }

    // 요청된 언어가 없으면 영어로 fallback
    const englishEntry = species.flavor_text_entries.find(
      (entry: FlavorTextEntry) => entry.language.name === 'en'
    );
    return englishEntry 
      ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
      : 'No description available.';
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

  static formatTypeName(type: string, language: Language = 'en'): string {
    // 동기 버전 사용 (캐시된 데이터만)
    return TypeFormatter.getTypeNameSync(type, language);
  }

  // 비동기 버전 (API 호출)
  static async formatTypeNameAsync(type: string, language: Language = 'en'): Promise<string> {
    return await TypeFormatter.getTypeName(type, language);
  }

  static formatStatName(stat: string, language: Language = 'en'): string {
    const statTranslations: { [key: string]: { [key in Language]: string } } = {
      'hp': { en: 'HP', ko: 'HP', ja: 'HP' },
      'attack': { en: 'Attack', ko: '공격', ja: '攻撃' },
      'defense': { en: 'Defense', ko: '방어', ja: '防御' },
      'special-attack': { en: 'Special Attack', ko: '특수공격', ja: '特攻' },
      'special-defense': { en: 'Special Defense', ko: '특수방어', ja: '特防' },
      'speed': { en: 'Speed', ko: '스피드', ja: '素早さ' }
    };
    
    const translation = statTranslations[stat];
    if (translation && translation[language]) {
      return translation[language];
    }
    
    return stat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 기본 영어 특성 이름 포맷팅 (fallback용)
  static formatAbilityName(abilityName: string): string {
    return abilityName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 다국어 특성 이름 포맷팅 (동기 버전)
  static formatAbilityNameSync(abilityName: string, language: Language = 'en'): string {
    return AbilityFormatter.getAbilityNameSync(abilityName, language);
  }

  // 다국어 특성 이름 포맷팅 (비동기 버전)
  static async formatAbilityNameAsync(abilityName: string, language: Language = 'en'): Promise<string> {
    return await AbilityFormatter.getAbilityName(abilityName, language);
  }
}
