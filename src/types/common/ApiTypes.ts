// API 응답에서 공통으로 사용되는 참조 구조
export interface ApiReference {
  name: string;
  url: string;
}

// 다국어 이름 엔트리
export interface LanguageEntry {
  language: ApiReference;
  name: string;
}

// 버전 관련 엔트리
export interface VersionEntry {
  version: ApiReference;
  language: ApiReference;
}

// 설명 텍스트 엔트리
export interface FlavorTextEntry {
  flavor_text: string;
  language: ApiReference;
  version: ApiReference;
}

// 효과 설명 엔트리
export interface EffectEntry {
  effect: string;
  language: ApiReference;
  short_effect: string;
}
