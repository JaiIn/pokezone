import { Language } from '../../contexts/LanguageContext';
import { TypeApiService } from '../api/TypeApiService';
import { PokeType } from '../../types/common/TypeTypes';

export class TypeFormatter {
  private static typeTranslations = new Map<string, Map<Language, string>>();

  // API를 통해 타입의 다국어 이름 가져오기
  static async getTypeName(typeName: string, language: Language = 'en'): Promise<string> {
    try {
      // 캐시에서 먼저 확인
      const cached = this.typeTranslations.get(typeName)?.get(language);
      if (cached) {
        return cached;
      }

      // API에서 타입 정보 가져오기
      const typeData = await TypeApiService.getType(typeName);
      
      // 해당 언어의 이름 찾기
      const localizedName = typeData.names.find(name => name.language.name === language);
      
      if (localizedName) {
        // 캐시에 저장
        if (!this.typeTranslations.has(typeName)) {
          this.typeTranslations.set(typeName, new Map());
        }
        this.typeTranslations.get(typeName)!.set(language, localizedName.name);
        
        return localizedName.name;
      }
      
      // 해당 언어가 없으면 영어로 fallback
      const englishName = typeData.names.find(name => name.language.name === 'en');
      const fallbackName = englishName ? englishName.name : this.formatEnglishTypeName(typeName);
      
      return fallbackName;
    } catch (error) {
      console.warn(`Failed to get type name for ${typeName}:`, error);
      // API 실패 시 영어 이름으로 fallback
      return this.formatEnglishTypeName(typeName);
    }
  }

  // 영어 타입 이름 포맷팅 (fallback용)
  private static formatEnglishTypeName(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  // 동기 버전 (캐시된 데이터만 사용)
  static getTypeNameSync(typeName: string, language: Language = 'en'): string {
    const cached = this.typeTranslations.get(typeName)?.get(language);
    return cached || this.formatEnglishTypeName(typeName);
  }

  // 주요 타입들 미리 로딩
  static async preloadCommonTypes(language: Language = 'ko'): Promise<void> {
    const commonTypes = [
      'normal', 'fighting', 'flying', 'poison',
      'ground', 'rock', 'bug', 'ghost', 
      'steel', 'fire', 'water', 'grass',
      'electric', 'psychic', 'ice', 'dragon',
      'dark', 'fairy'
    ];

    console.log(`🔄 타입 ${language} 번역 미리 로딩 중...`);
    
    const promises = commonTypes.map(async typeName => {
      try {
        await this.getTypeName(typeName, language);
      } catch (error) {
        console.warn(`Failed to preload type ${typeName}:`, error);
      }
    });

    await Promise.all(promises);
    console.log(`✅ 타입 ${language} 번역 로딩 완료`);
  }
}
