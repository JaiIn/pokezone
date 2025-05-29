import React from 'react';
import { EvolutionPokemon, getStageLabel } from '../../../../utils/evolutionUtils';
import { EvolutionPokemonCard } from './EvolutionPokemonCard';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface EvolutionStageProps {
  stage: EvolutionPokemon[];
  stageIndex: number;
  onPokemonClick: (pokemonName: string, pokemonId: string) => void;
}

export function EvolutionStage({ stage, stageIndex, onPokemonClick }: EvolutionStageProps) {
  const { language } = useLanguage();
  const stageLabel = getStageLabel(stageIndex, language);

  return (
    <div className="flex flex-col items-center">
      {/* 단계 레이블 */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-semibold text-gray-700 dark:text-slate-300">
          {stageLabel}
        </span>
      </div>

      {/* 포켓몬들 */}
      <div className="space-y-4">
        {stage.map((pokemon, index) => (
          <EvolutionPokemonCard
            key={`${pokemon.name}-${index}`}
            pokemon={pokemon}
            stageIndex={stageIndex}
            onPokemonClick={onPokemonClick}
          />
        ))}
      </div>
    </div>
  );
}
