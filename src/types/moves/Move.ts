import { ApiReference, LanguageEntry, EffectEntry } from '../common';

// 기술 정보
export interface Move {
  id: number;
  name: string;
  names: LanguageEntry[];
  power?: number;
  pp: number;
  accuracy?: number;
  priority: number;
  damage_class: ApiReference;
  type: ApiReference;
  effect_entries: EffectEntry[];
}
