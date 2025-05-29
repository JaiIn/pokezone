import axios from 'axios';
import { PokeType } from '../../types/common/TypeTypes';

export class TypeApiService {
  private static BASE_URL = 'https://pokeapi.co/api/v2';
  private static typeCache = new Map<string, PokeType>();

  static async getType(typeNameOrId: string | number): Promise<PokeType> {
    const cacheKey = typeNameOrId.toString();
    
    // 캐시에서 먼저 확인
    if (this.typeCache.has(cacheKey)) {
      return this.typeCache.get(cacheKey)!;
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/type/${typeNameOrId}`);
      const typeData: PokeType = response.data;
      
      // 캐시에 저장
      this.typeCache.set(cacheKey, typeData);
      this.typeCache.set(typeData.id.toString(), typeData);
      this.typeCache.set(typeData.name, typeData);
      
      return typeData;
    } catch (error) {
      console.error(`Failed to fetch type ${typeNameOrId}:`, error);
      throw error;
    }
  }

  // 여러 타입을 한 번에 가져오기 (미리 로딩용)
  static async preloadTypes(typeNames: string[]): Promise<void> {
    const promises = typeNames.map(typeName => 
      this.getType(typeName).catch(error => {
        console.warn(`Failed to preload type ${typeName}:`, error);
        return null;
      })
    );
    
    await Promise.all(promises);
  }
}
