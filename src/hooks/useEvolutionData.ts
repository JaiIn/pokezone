import { useMemo } from 'react';
import { EvolutionChain } from '../types/pokemon';
import { processEvolutionChain, EvolutionPokemon } from '../utils/evolutionUtils';

export function useEvolutionData(evolutionChain: EvolutionChain | undefined) {
  const evolutionStages = useMemo(() => {
    if (!evolutionChain) return [];
    return processEvolutionChain(evolutionChain.chain);
  }, [evolutionChain]);

  const hasEvolution = evolutionStages.length > 1;
  const totalStages = evolutionStages.length;

  return {
    evolutionStages,
    hasEvolution,
    totalStages
  };
}
