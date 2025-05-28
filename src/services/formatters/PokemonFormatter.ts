import { Pokemon, PokemonSpecies } from '../../types/pokemon';

export class PokemonFormatter {
  static getDisplayName(pokemon: Pokemon, species?: PokemonSpecies | null): string {
    return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  }

  static getFlavorText(species: PokemonSpecies): string {
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
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

  static formatTypeName(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  static formatStatName(stat: string): string {
    return stat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  static formatAbilityName(abilityName: string): string {
    return abilityName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
