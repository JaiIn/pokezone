import axios from 'axios';
import { Pokemon, PokemonListResponse, PokemonSpecies, Generation, GENERATIONS, EvolutionChain, Move, PokemonDetail } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonService {
  static async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch Pokemon list.');
    }
  }

  static async getPokemonByGeneration(generation: Generation, limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    if (generation.id === 0) {
      // 전체 세대
      return this.getPokemonList(limit, offset);
    }
    
    const startId = generation.startId + offset;
    const endId = Math.min(generation.endId, startId + limit - 1);
    
    const results = [];
    for (let i = startId; i <= endId; i++) {
      results.push({
        name: `pokemon-${i}`,
        url: `${BASE_URL}/pokemon/${i}/`
      });
    }
    
    const hasNextPage = startId + limit <= generation.endId;
    
    return {
      count: generation.endId - generation.startId + 1,
      next: hasNextPage ? `next-page` : null,
      previous: offset > 0 ? `prev-page` : null,
      results
    };
  }

  static async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    try {
      const response = await axios.get(`${BASE_URL}/pokemon/${nameOrId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch Pokemon data.');
    }
  }

  static async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
    try {
      const response = await axios.get(`${BASE_URL}/pokemon-species/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch Pokemon species data.');
    }
  }

  static async searchPokemon(query: string): Promise<Pokemon | null> {
    try {
      const normalizedQuery = query.trim().toLowerCase();
      return await this.getPokemon(normalizedQuery);
    } catch (error) {
      return null;
    }
  }

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

  static getGenerationByPokemonId(id: number): Generation | null {
    return GENERATIONS.find(gen => 
      gen.id !== 0 && id >= gen.startId && id <= gen.endId
    ) || null;
  }

  // Evolution chain data
  static async getEvolutionChain(url: string): Promise<EvolutionChain> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch evolution chain data.');
    }
  }

  // Move data
  static async getMove(nameOrId: string | number): Promise<Move> {
    try {
      const response = await axios.get(`${BASE_URL}/move/${nameOrId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch move data.');
    }
  }

  // Pokemon detailed information (including evolution chain)
  static async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
    const pokemon = await this.getPokemon(nameOrId);
    const species = await this.getPokemonSpecies(pokemon.id);
    
    let evolutionChain: EvolutionChain | undefined;
    
    try {
      evolutionChain = await this.getEvolutionChain(species.evolution_chain.url);
    } catch (error) {
      console.warn('Failed to fetch evolution chain data:', error);
    }
    
    return {
      ...pokemon,
      species,
      evolutionChain
    };
  }

  // Extract Pokemon names from evolution chain
  static extractEvolutionChain(chain: EvolutionChain): string[][] {
    const evolutionStages: string[][] = [];
    
    const extractFromChain = (detail: any, stage: number = 0) => {
      if (!evolutionStages[stage]) {
        evolutionStages[stage] = [];
      }
      evolutionStages[stage].push(detail.species.name);
      
      if (detail.evolves_to && detail.evolves_to.length > 0) {
        detail.evolves_to.forEach((evolution: any) => {
          extractFromChain(evolution, stage + 1);
        });
      }
    };
    
    extractFromChain(chain.chain);
    return evolutionStages;
  }

  // Format move name
  static formatMoveName(move: Move): string {
    const englishName = move.names.find(name => name.language.name === 'en');
    if (englishName) {
      return englishName.name;
    }
    
    return move.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Format move name (simple version)
  static formatSimpleMoveName(englishName: string): string {
    return englishName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Format damage class name
  static formatDamageClassName(damageClass: string): string {
    return damageClass.charAt(0).toUpperCase() + damageClass.slice(1);
  }

  // Format ability name
  static formatAbilityName(abilityName: string): string {
    return abilityName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Format learn method name
  static formatLearnMethodName(method: string): string {
    return method.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
