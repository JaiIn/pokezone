import { ApiReference, LanguageEntry, EffectEntry, FlavorTextEntry } from '../common';

// 포켓몬 특성 정보
export interface Ability {
  id: number;
  name: string;
  names: LanguageEntry[];
  is_main_series: boolean;
  generation: ApiReference;
  effect_entries: EffectEntry[];
  effect_changes: any[];
  flavor_text_entries: FlavorTextEntry[];
  pokemon: any[];
}
