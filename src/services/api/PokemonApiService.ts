import axios from 'axios';
import { Pokemon, PokemonListResponse, PokemonSpecies, Generation, EvolutionChain, Move, PokemonDetail } from '../../types/pokemon';
import { ApiErrorHandler } from './ApiErrorHandler';

export class PokemonApiService {
  private static readonly BASE_URL = 'https://pokeapi.co/api/v2';

  static async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    return ApiErrorHandler.safeApiCall(
      async () => {
        const response = await axios.get(`${this.BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
        return response.data;
      },
      'fetch Pokemon list'
    );
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
        url: `${this.BASE_URL}/pokemon/${i}/`
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
    return ApiErrorHandler.safeApiCall(
      async () => {
        const response = await axios.get(`${this.BASE_URL}/pokemon/${nameOrId}`);
        return response.data;
      },
      'fetch Pokemon data'
    );
  }

  static async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
    return ApiErrorHandler.safeApiCall(
      async () => {
        const response = await axios.get(`${this.BASE_URL}/pokemon-species/${id}`);
        return response.data;
      },
      'fetch Pokemon species data'
    );
  }

  static async getEvolutionChain(url: string): Promise<EvolutionChain> {
    return ApiErrorHandler.safeApiCall(
      async () => {
        const response = await axios.get(url);
        return response.data;
      },
      'fetch evolution chain data'
    );
  }

  static async getMove(nameOrId: string | number): Promise<Move> {
    return ApiErrorHandler.safeApiCall(
      async () => {
        const response = await axios.get(`${this.BASE_URL}/move/${nameOrId}`);
        return response.data;
      },
      'fetch move data'
    );
  }

  static async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
    return ApiErrorHandler.safeApiCall(
      async () => {
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
      },
      'fetch Pokemon detailed information'
    );
  }
}
