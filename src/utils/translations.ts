import { Language } from '../contexts/LanguageContext';

interface Translations {
  [key: string]: {
    en: string;
    ko: string;
    ja: string;
  };
}

const translations: Translations = {
  'basic_info': { en: 'Basic Info', ko: '기본 정보', ja: '基本情報' },
  'evolution': { en: 'Evolution', ko: '진화', ja: '進化' },
  'moves': { en: 'Moves', ko: '기술', ja: '技' },
  'abilities': { en: 'Abilities', ko: '특성', ja: '特性' },
  'type': { en: 'Type', ko: '타입', ja: 'タイプ' },
  'height': { en: 'Height', ko: '키', ja: '高さ' },
  'weight': { en: 'Weight', ko: '몸무게', ja: '重さ' },
  'base_experience': { en: 'Base Experience', ko: '기초 경험치', ja: '基礎経験値' },
  'base_stats': { en: 'Base Stats', ko: '종족값', ja: '種族値' },
  'total_stats': { en: 'Total Stats', ko: '종족값 합계', ja: '種族値合計' },
  
  'hp': { en: 'HP', ko: 'HP', ja: 'HP' },
  'attack': { en: 'Attack', ko: '공격', ja: '攻撃' },
  'defense': { en: 'Defense', ko: '방어', ja: '防御' },
  'special_attack': { en: 'Special Attack', ko: '특수공격', ja: '特攻' },
  'special_defense': { en: 'Special Defense', ko: '특수방어', ja: '特防' },
  'speed': { en: 'Speed', ko: '스피드', ja: '素早さ' },
  
  'ability': { en: 'Ability', ko: '특성', ja: '特性' },
  'hidden_ability': { en: 'Hidden Ability', ko: '숨겨진 특성', ja: '隠れ特性' },
  
  'evolution_chain': { en: 'Evolution Chain', ko: '진화', ja: '進化系統' },
  'check_evolution_stages': { en: 'Check the evolution stages and conditions of Pokemon', ko: '포켓몬의 진화 단계와 조건을 확인하세요', ja: 'ポケモンの進化段階と条件을確인' },
  'level': { en: 'Level', ko: '레벨', ja: 'レベル' },
  'stage_1': { en: '1st Stage', ko: '1단계', ja: '1段階' },
  'stage_2': { en: '2nd Stage', ko: '2단계', ja: '2段階' },
  'stage_3': { en: '3rd Stage', ko: '3단계', ja: '3段階' },
  'basic': { en: 'Basic', ko: '기본', ja: '基本' },
  
  'learnable_moves': { en: 'Learnable Moves', ko: '배울 수 있는 기술', ja: '覚える技' },
  'check_all_moves': { en: 'Check all moves this Pokemon can learn', ko: '이 포켓몬이 배울 수 있는 모든 기술을 확인하세요', ja: 'このポケモンが覚える全ての技を확인' },
  'level_up_moves': { en: 'Level-up Moves', ko: '레벨업 기술', ja: 'レベルアップ技' },
  'moves_learned_naturally': { en: 'Moves learned naturally through leveling up', ko: '레벨업으로 자연스럽게 배우는 기술', ja: 'レベルアップで自然に覚える技' },
  'tm_tr_moves': { en: 'TM/TR Moves', ko: 'TM/TR 기술', ja: 'TM/TR技' },
  'moves_learned_tm': { en: 'Moves that can be learned using Technical Machines', ko: '기술머신으로 배울 수 있는 기술', ja: '技マシンで覚える技' },
  'special_moves': { en: 'Special Moves', ko: '특수 기술', ja: '特殊技' },
  'moves_learned_special': { en: 'Moves learned through special methods', ko: '특수한 방법으로 배우는 기술', ja: '特殊な方法で覚える技' },
  
  'pokemon_compare': { en: 'Pokemon Compare', ko: '포켓몬 비교', ja: 'ポケモン比較' },
  'world_cup': { en: 'World Cup', ko: '월드컵', ja: 'ワールドカップ' },
  'first_pokemon': { en: 'First Pokemon', ko: '첫 번째 포켓몬', ja: '1匹目のポケモン' },
  'second_pokemon': { en: 'Second Pokemon', ko: '두 번째 포켓몬', ja: '2匹目のポケモン' },
  'select_first_pokemon': { en: 'Select first Pokemon', ko: '첫 번째 포켓몬 선택', ja: '1匹目のポケモンを選択' },
  'select_second_pokemon': { en: 'Select second Pokemon', ko: '두 번째 포켓몬 선택', ja: '2匹目のポケモンを선택' },
  
  'enter_pokemon_name': { en: 'Enter Pokemon name or number...', ko: '포켓몬 이름이나 번호를 입력하세요...', ja: 'ポケモン名または番号を入力...' },
  'generation_select': { en: 'Generation Select', ko: '세대 선택', ja: '世代選択' },
  'all_generations': { en: 'All Generations', ko: '모든 세대', ja: '全世代' },
  'load_more_pokemon': { en: 'Load More Pokemon', ko: '더 많은 포켓몬 로드', ja: 'さらにポケモンを読み込み' },
  
  'select': { en: 'Select', ko: '선택', ja: '選択' },
  'loading': { en: 'Loading...', ko: '로딩 중...', ja: '読み込み中...' },
  'error': { en: 'Error', ko: '오류', ja: 'エラー' },
  'retry': { en: 'Retry', ko: '다시 시도', ja: '재시행' },
  'close': { en: 'Close', ko: '닫기', ja: '閉じる' },
  
  'shiny': { en: 'Shiny', ko: '이로치', ja: '色違い' },
  'normal': { en: 'Normal', ko: '일반', ja: '通常' },
  'shiny_pokemon': { en: 'Shiny Pokemon', ko: '색이 다른 포켓몬', ja: '色違いポケモン' },
  'normal_color': { en: 'Normal Color', ko: '일반 색상', ja: '通常色' },
  'pokemon_forms': { en: 'Pokemon Forms', ko: '색이 다른 포켓몬', ja: 'ポケモンの姿' }
};

export function t(key: string, language: Language = 'en'): string {
  const translation = translations[key];
  if (!translation) {
    return key;
  }
  return translation[language] || translation.en;
}

export { translations };
