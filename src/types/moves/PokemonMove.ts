import { ApiReference } from '../common';

// 기술 학습 상세 정보
export interface MoveLearnDetail {
  level_learned_at: number;
  move_learn_method: ApiReference;
  version_group: ApiReference;
}

// 포켓몬이 학습하는 기술 엔트리
export interface PokemonMoveEntry {
  move: ApiReference;
  version_group_details: MoveLearnDetail[];
}

// 레거시 인터페이스 (호환성)
export interface PokemonMove extends PokemonMoveEntry {}
