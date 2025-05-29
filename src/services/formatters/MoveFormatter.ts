import { Move } from '../../types';
import { Language } from '../../contexts/LanguageContext';
import { AbilityApiService } from '../api/AbilityApiService';

export class MoveFormatter {
  private static moveTranslations = new Map<string, Map<Language, string>>();

  // 다국어 지원 기술 이름 포맷팅
  static formatMoveName(move: Move, language: Language = 'en'): string {
    const localizedName = move.names.find(name => name.language.name === language);
    if (localizedName) {
      return localizedName.name;
    }
    
    // 영어로 fallback
    const englishName = move.names.find(name => name.language.name === 'en');
    if (englishName) {
      return englishName.name;
    }
    
    return this.formatSimpleMoveName(move.name);
  }

  // API를 통해 기술의 다국어 이름 가져오기
  static async getMoveName(moveName: string, language: Language = 'en'): Promise<string> {
    try {
      // 캐시 초기화 확인
      if (!this.moveTranslations) {
        this.moveTranslations = new Map();
      }
      
      // 캐시에서 먼저 확인
      const cached = this.moveTranslations.get(moveName)?.get(language);
      if (cached) {
        return cached;
      }

      // API에서 기술 정보 가져오기
      const moveData = await AbilityApiService.getMove(moveName);
      
      // 해당 언어의 이름 찾기
      const localizedName = moveData.names?.find(name => name.language.name === language);
      
      if (localizedName) {
        // 캐시에 저장
        if (!this.moveTranslations.has(moveName)) {
          this.moveTranslations.set(moveName, new Map());
        }
        this.moveTranslations.get(moveName)!.set(language, localizedName.name);
        
        return localizedName.name;
      }
      
      // 해당 언어가 없으면 영어로 fallback
      const englishName = moveData.names?.find(name => name.language.name === 'en');
      const fallbackName = englishName ? englishName.name : this.formatSimpleMoveName(moveName);
      
      return fallbackName;
    } catch (error) {
      console.warn(`Failed to get move name for ${moveName}:`, error);
      // API 실패 시 영어 이름으로 fallback
      return this.formatSimpleMoveName(moveName);
    }
  }

  // 동기 버전 (캐시된 데이터만 사용)
  static getMoveNameSync(moveName: string, language: Language = 'en'): string {
    if (!this.moveTranslations) {
      this.moveTranslations = new Map();
    }
    const cached = this.moveTranslations.get(moveName)?.get(language);
    return cached || this.formatSimpleMoveName(moveName);
  }

  static formatSimpleMoveName(englishName: string): string {
    return englishName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  static formatDamageClassName(damageClass: string): string {
    return damageClass.charAt(0).toUpperCase() + damageClass.slice(1);
  }

  static formatLearnMethodName(method: string): string {
    return method.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // 주요 기술들 미리 로딩
  static async preloadCommonMoves(language: Language = 'ko'): Promise<void> {
    const commonMoves = [
      'tackle', 'scratch', 'growl', 'leer', 'ember', 'water-gun',
      'vine-whip', 'pound', 'karate-chop', 'double-slap', 'comet-punch',
      'mega-punch', 'pay-day', 'fire-punch', 'ice-punch', 'thunder-punch',
      'quick-attack', 'rage', 'teleport', 'night-shade', 'mimic',
      'screech', 'double-team', 'recover', 'harden', 'minimize',
      'smokescreen', 'confuse-ray', 'withdraw', 'defense-curl'
    ];

    console.log(`🔄 기술 ${language} 번역 미리 로딩 중...`);
    
    const promises = commonMoves.map(async moveName => {
      try {
        await this.getMoveName(moveName, language);
      } catch (error) {
        console.warn(`Failed to preload move ${moveName}:`, error);
      }
    });

    await Promise.all(promises);
    console.log(`✅ 기술 ${language} 번역 로딩 완료`);
  }
}
