import { Language } from '../../contexts/LanguageContext';
import { AbilityApiService } from '../api/AbilityApiService';
import { Ability } from '../../types';

export class AbilityFormatter {
  private static abilityTranslations = new Map<string, Map<Language, string>>();

  // API를 통해 특성의 다국어 이름 가져오기
  static async getAbilityName(abilityName: string, language: Language = 'en'): Promise<string> {
    try {
      // 캐시 초기화 확인
      if (!this.abilityTranslations) {
        this.abilityTranslations = new Map();
      }
      
      // 캐시에서 먼저 확인
      const cached = this.abilityTranslations.get(abilityName)?.get(language);
      if (cached) {
        return cached;
      }

      // API에서 특성 정보 가져오기
      const abilityData = await AbilityApiService.getAbility(abilityName);
      
      // 해당 언어의 이름 찾기
      const localizedName = abilityData.names.find(name => name.language.name === language);
      
      if (localizedName) {
        // 캐시에 저장
        if (!this.abilityTranslations.has(abilityName)) {
          this.abilityTranslations.set(abilityName, new Map());
        }
        this.abilityTranslations.get(abilityName)!.set(language, localizedName.name);
        
        return localizedName.name;
      }
      
      // 해당 언어가 없으면 영어로 fallback
      const englishName = abilityData.names.find(name => name.language.name === 'en');
      const fallbackName = englishName ? englishName.name : this.formatEnglishAbilityName(abilityName);
      
      return fallbackName;
    } catch (error) {
      console.warn(`Failed to get ability name for ${abilityName}:`, error);
      // API 실패 시 영어 이름으로 fallback
      return this.formatEnglishAbilityName(abilityName);
    }
  }

  // 영어 특성 이름 포맷팅 (fallback용)
  private static formatEnglishAbilityName(abilityName: string): string {
    return abilityName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 동기 버전 (캐시된 데이터만 사용)
  static getAbilityNameSync(abilityName: string, language: Language = 'en'): string {
    if (!this.abilityTranslations) {
      this.abilityTranslations = new Map();
    }
    const cached = this.abilityTranslations.get(abilityName)?.get(language);
    return cached || this.formatEnglishAbilityName(abilityName);
  }

  // 특성 설명 가져오기
  static async getAbilityDescription(abilityName: string, language: Language = 'en'): Promise<string> {
    try {
      const abilityData = await AbilityApiService.getAbility(abilityName);
      
      // 해당 언어의 설명 찾기
      const localizedEntry = abilityData.flavor_text_entries.find(
        entry => entry.language.name === language
      );
      
      if (localizedEntry) {
        return localizedEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ');
      }
      
      // 영어로 fallback
      const englishEntry = abilityData.flavor_text_entries.find(
        entry => entry.language.name === 'en'
      );
      
      return englishEntry 
        ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
        : 'No description available.';
    } catch (error) {
      console.warn(`Failed to get ability description for ${abilityName}:`, error);
      return 'Description not available.';
    }
  }

  // 주요 특성들 미리 로딩
  static async preloadCommonAbilities(language: Language = 'ko'): Promise<void> {
    const commonAbilities = [
      'overgrow', 'blaze', 'torrent', 'swarm', 'keen-eye', 'tangled-feet',
      'big-pecks', 'pressure', 'compoundeyes', 'tinted-lens', 'shield-dust',
      'run-away', 'shed-skin', 'guts', 'marvel-scale', 'wonder-skin',
      'synchronize', 'inner-focus', 'steadfast', 'stench', 'effect-spore',
      'dry-skin', 'damp', 'sand-veil', 'static', 'lightning-rod', 'sand-rush'
    ];

    console.log(`🔄 특성 ${language} 번역 미리 로딩 중...`);
    
    const promises = commonAbilities.map(async abilityName => {
      try {
        await this.getAbilityName(abilityName, language);
      } catch (error) {
        console.warn(`Failed to preload ability ${abilityName}:`, error);
      }
    });

    await Promise.all(promises);
    console.log(`✅ 특성 ${language} 번역 로딩 완료`);
  }
}
