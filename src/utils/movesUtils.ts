import { Move } from '../types/pokemon';

export interface MoveWithMetadata {
  move: { name: string; url: string };
  level?: number;
  method?: string;
}

export interface CategorizedMoves {
  levelUpMoves: MoveWithMetadata[];
  machineMoves: MoveWithMetadata[];
  otherMoves: MoveWithMetadata[];
}

export interface MoveStats {
  levelUpCount: number;
  machineCount: number;
  otherCount: number;
  totalCount: number;
}

interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}

interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: VersionGroupDetail[];
}

export const filterAndSortLevelUpMoves = (moves: PokemonMove[]): MoveWithMetadata[] => {
  return moves
    .filter(pokemonMove =>
      pokemonMove.version_group_details.some(
        (detail: VersionGroupDetail) => detail.move_learn_method.name === 'level-up'
      )
    )
    .map(pokemonMove => {
      const levelUpDetail = pokemonMove.version_group_details.find(
        (detail: VersionGroupDetail) => detail.move_learn_method.name === 'level-up'
      );
      return {
        move: pokemonMove.move,
        level: levelUpDetail?.level_learned_at || 0
      };
    })
    .sort((a, b) => (a.level || 0) - (b.level || 0));
};

export const filterMachineMoves = (moves: PokemonMove[]): MoveWithMetadata[] => {
  return moves
    .filter(pokemonMove =>
      pokemonMove.version_group_details.some(
        (detail: VersionGroupDetail) => detail.move_learn_method.name === 'machine'
      )
    )
    .map(pokemonMove => ({
      move: pokemonMove.move
      // level을 undefined로 처리 (null 대신)
    }));
};

export const filterOtherMoves = (moves: PokemonMove[]): MoveWithMetadata[] => {
  return moves
    .filter(pokemonMove =>
      pokemonMove.version_group_details.some(
        (detail: VersionGroupDetail) => detail.move_learn_method.name !== 'level-up' && detail.move_learn_method.name !== 'machine'
      )
    )
    .map(pokemonMove => {
      const otherDetail = pokemonMove.version_group_details.find(
        (detail: VersionGroupDetail) => detail.move_learn_method.name !== 'level-up' && detail.move_learn_method.name !== 'machine'
      );
      return {
        move: pokemonMove.move,
        method: otherDetail?.move_learn_method.name || 'unknown'
      };
    });
};

export const categorizeMoves = (moves: any[]): CategorizedMoves => {
  return {
    levelUpMoves: filterAndSortLevelUpMoves(moves),
    machineMoves: filterMachineMoves(moves),
    otherMoves: filterOtherMoves(moves)
  };
};

export const calculateMoveStats = (categorizedMoves: CategorizedMoves): MoveStats => {
  return {
    levelUpCount: categorizedMoves.levelUpMoves.length,
    machineCount: categorizedMoves.machineMoves.length,
    otherCount: categorizedMoves.otherMoves.length,
    totalCount: categorizedMoves.levelUpMoves.length + 
                categorizedMoves.machineMoves.length + 
                categorizedMoves.otherMoves.length
  };
};
