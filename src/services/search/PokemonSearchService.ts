import { Pokemon } from '../../types/pokemon';
import { PokemonApiService } from '../api/PokemonApiService';

export class PokemonSearchService {
  static async searchPokemon(query: string): Promise<Pokemon | null> {
    try {
      const normalizedQuery = query.trim().toLowerCase();
      return await PokemonApiService.getPokemon(normalizedQuery);
    } catch (error) {
      return null;
    }
  }

  // 향후 확장 가능한 검색 기능들
  static async searchByType(type: string): Promise<Pokemon[]> {
    // TODO: 타입별 검색 구현
    throw new Error('Not implemented yet');
  }

  static async searchByGeneration(generation: number): Promise<Pokemon[]> {
    // TODO: 세대별 검색 구현
    throw new Error('Not implemented yet');
  }

  static async searchByAbility(ability: string): Promise<Pokemon[]> {
    // TODO: 특성별 검색 구현
    throw new Error('Not implemented yet');
  }
}
