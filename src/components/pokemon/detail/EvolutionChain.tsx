import React from 'react';
import { PokemonDetail } from '../../../types';
import { useEvolutionData } from '../../../hooks/useEvolutionData';
import { EvolutionHeader } from './evolution/EvolutionHeader';
import { EvolutionTimeline } from './evolution/EvolutionTimeline';
import { NoEvolutionMessage } from './evolution/NoEvolutionMessage';
import { EmptyEvolutionState } from './evolution/EmptyEvolutionState';

interface EvolutionChainProps {
  fullDetail: PokemonDetail | null;
  onPokemonSelect?: (pokemonName: string, pokemonId: string) => void;
}

export function EvolutionChain({ fullDetail, onPokemonSelect }: EvolutionChainProps) {
  const { evolutionStages, hasEvolution } = useEvolutionData(fullDetail?.evolutionChain);

  if (!fullDetail?.evolutionChain) {
    return <EmptyEvolutionState />;
  }

  const handlePokemonClick = (pokemonName: string, pokemonId: string) => {
    if (onPokemonSelect) {
      onPokemonSelect(pokemonName, pokemonId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <EvolutionHeader />
      
      {hasEvolution ? (
        <EvolutionTimeline 
          stages={evolutionStages} 
          onPokemonClick={handlePokemonClick} 
        />
      ) : (
        <NoEvolutionMessage />
      )}
    </div>
  );
}
