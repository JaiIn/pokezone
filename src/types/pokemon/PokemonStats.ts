import { ApiReference } from '../common';

// 포켓몬 개별 스탯
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: ApiReference;
}

// 포켓몬 타입
export interface PokemonType {
  slot: number;
  type: ApiReference;
}

// 포켓몬 특성
export interface PokemonAbility {
  ability: ApiReference;
  is_hidden: boolean;
  slot: number;
}
