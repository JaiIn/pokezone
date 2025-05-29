import axios from 'axios';
import { Ability, Move } from '../../types';
import { ApiErrorHandler } from './ApiErrorHandler';

export class AbilityApiService {
  private static readonly BASE_URL = 'https://pokeapi.co/api/v2';
  private static abilityCache = new Map<string, Ability>();

  static async getAbility(nameOrId: string | number): Promise<Ability> {
    const cacheKey = nameOrId.toString();
    
    // 캐시에서 먼저 확인
    if (this.abilityCache.has(cacheKey)) {
      return this.abilityCache.get(cacheKey)!;
    }

    return ApiErrorHandler.safeApiCall(
      async () => {
        const response = await axios.get(`${this.BASE_URL}/ability/${nameOrId}`);
        const abilityData: Ability = response.data;
        
        // 캐시에 저장
        this.abilityCache.set(cacheKey, abilityData);
        this.abilityCache.set(abilityData.id.toString(), abilityData);
        this.abilityCache.set(abilityData.name, abilityData);
        
        return abilityData;
      },
      'fetch ability data'
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

  // 여러 특성을 한 번에 가져오기 (미리 로딩용)
  static async preloadAbilities(abilityNames: string[]): Promise<void> {
    const promises = abilityNames.map(abilityName => 
      this.getAbility(abilityName).catch(error => {
        console.warn(`Failed to preload ability ${abilityName}:`, error);
        return null;
      })
    );
    
    await Promise.all(promises);
  }
}
