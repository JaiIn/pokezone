import React from 'react';
import { Move } from '../../../../types';
import { PokemonService } from '../../../../services/pokemonService';
import { MoveStatsDisplay } from './MoveStatsDisplay';
import { MoveWithMetadata } from '../../../../utils/movesUtils';

interface MoveCardProps {
  moveData: MoveWithMetadata;
  colorClass?: string;
  moveDetail?: Move;
  onLoadDetail: (moveName: string) => void;
}

export const MoveCard = React.memo(({ moveData, colorClass = 'green', moveDetail, onLoadDetail }: MoveCardProps) => {
  const { move, level, method } = moveData;

  const getLabelContent = () => {
    if (level !== undefined) {
      return `🌳 Level ${level}`;
    }
    if (method) {
      return `✨ ${PokemonService.formatLearnMethodName(method)}`;
    }
    return '🔧 TM';
  };

  return (
    <div
      className={`group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 border border-transparent hover:border-${colorClass}-300 dark:hover:border-${colorClass}-500`}
      onClick={() => onLoadDetail(move.name)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-1 bg-${colorClass}-100 dark:bg-${colorClass}-900 text-${colorClass}-800 dark:text-${colorClass}-200 text-xs font-medium rounded-full`}>
          {getLabelContent()}
        </span>
        {moveDetail && (
          <span
            className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetail.type.name)}`}
          >
            {PokemonService.formatTypeName(moveDetail.type.name)}
          </span>
        )}
      </div>
      <div className={`font-medium capitalize text-gray-900 dark:text-slate-100 group-hover:text-${colorClass}-600 dark:group-hover:text-${colorClass}-400`}>
        {PokemonService.formatSimpleMoveName(move.name)}
      </div>
      {moveDetail && <MoveStatsDisplay move={moveDetail} />}
    </div>
  );
});

MoveCard.displayName = 'MoveCard';
