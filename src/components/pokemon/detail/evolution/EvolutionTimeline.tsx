import React from 'react';
import { EvolutionPokemon } from '../../../../utils/evolutionUtils';
import { EvolutionStage } from './EvolutionStage';
import { EvolutionArrow } from './EvolutionArrow';

interface EvolutionTimelineProps {
  stages: EvolutionPokemon[][];
  onPokemonClick: (pokemonName: string, pokemonId: string) => void;
}

export function EvolutionTimeline({ stages, onPokemonClick }: EvolutionTimelineProps) {
  return (
    <div className="flex items-center justify-center overflow-x-auto pb-4">
      <div className="flex items-center space-x-8 min-w-max">
        {stages.map((stage, stageIndex) => (
          <React.Fragment key={stageIndex}>
            <EvolutionStage
              stage={stage}
              stageIndex={stageIndex}
              onPokemonClick={onPokemonClick}
            />
            
            {/* 진화 화살표 (마지막 단계가 아닌 경우) */}
            {stageIndex < stages.length - 1 && (
              <EvolutionArrow
                nextStagePokemon={stages[stageIndex + 1][0]}
                isLastStage={stageIndex === stages.length - 1}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
