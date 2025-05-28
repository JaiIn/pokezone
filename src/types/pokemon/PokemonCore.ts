import { PokemonSprites } from './PokemonSprites';
import { PokemonStat, PokemonType, PokemonAbility } from './PokemonStats';
import { ApiReference } from '../common';

// 기술 학습 상세 정보 (순환 참조 방지를 위해 여기서 정의)
interface MoveLearnDetail {
  level_learned_at: number;
  move_learn_method: ApiReference;
  version_group: ApiReference;
}

// 포켓몬이 학습하는 기술 엔트리
interface PokemonMoveEntry {
  move: ApiReference;
  version_group_details: MoveLearnDetail[];
}

// 핵심 포켓몬 인터페이스
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMoveEntry[];
}
