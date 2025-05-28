import { ApiReference } from '../common';

// 진화 조건 (복잡한 중첩 구조)
export interface EvolutionTrigger {
  min_level?: number;
  trigger: ApiReference;
  item?: ApiReference;
  time_of_day?: string;
  gender?: number;
  held_item?: ApiReference;
  known_move?: ApiReference;
  known_move_type?: ApiReference;
  location?: ApiReference;
  min_affection?: number;
  min_beauty?: number;
  min_happiness?: number;
  needs_overworld_rain?: boolean;
  party_species?: ApiReference;
  party_type?: ApiReference;
  relative_physical_stats?: number;
  trade_species?: ApiReference;
  turn_upside_down?: boolean;
}
