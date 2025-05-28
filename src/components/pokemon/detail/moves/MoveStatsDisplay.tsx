import React from 'react';
import { Move } from '../../../../types';
import { PokemonService } from '../../../../services/pokemonService';

interface MoveStatsDisplayProps {
  move: Move;
}

export function MoveStatsDisplay({ move }: MoveStatsDisplayProps) {
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
        <span className="flex items-center">
          {move.power ? (
            <><span className="text-red-500">💥</span> Power: {move.power}</>
          ) : (
            <><span className="text-blue-500">🔘</span> {PokemonService.formatDamageClassName(move.damage_class.name)}</>
          )}
        </span>
        <span className="flex items-center">
          <span className="text-purple-500">⚡</span> PP: {move.pp}
        </span>
      </div>
      {move.accuracy && (
        <div className="text-xs text-gray-600 dark:text-slate-400">
          <span className="text-orange-500">🎯</span> Accuracy: {move.accuracy}%
        </div>
      )}
    </div>
  );
}
