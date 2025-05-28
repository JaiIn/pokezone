import React from 'react';
import { EvolutionPokemon, formatEvolutionConditions } from '../../../../utils/evolutionUtils';
import { EvolutionConditionBadge } from './EvolutionConditionBadge';

interface EvolutionArrowProps {
  nextStagePokemon: EvolutionPokemon;
  isLastStage?: boolean;
}

export function EvolutionArrow({ nextStagePokemon, isLastStage = false }: EvolutionArrowProps) {
  if (isLastStage) return null;

  const condition = formatEvolutionConditions(nextStagePokemon);

  return (
    <div className="flex flex-col items-center mx-8">
      {/* 진화 조건 */}
      <div className="mb-4">
        <EvolutionConditionBadge condition={condition} />
      </div>

      {/* 화살표 */}
      <div className="text-4xl text-blue-500 dark:text-blue-400">
        ➡️
      </div>
    </div>
  );
}
