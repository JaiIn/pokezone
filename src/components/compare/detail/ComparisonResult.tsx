import React from 'react';
import { Pokemon, PokemonSpecies } from '../../../types/pokemon';
import { PokemonService } from '../../../services/pokemonService';

interface ComparisonResultProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  species1: PokemonSpecies | null;
  species2: PokemonSpecies | null;
}

export function ComparisonResult({ pokemon1, pokemon2, species1, species2 }: ComparisonResultProps) {
  const getTotalStats = (pokemon: Pokemon) => {
    return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  };

  return (
    <div className="card p-6 text-center">
      <h3 className="text-xl font-semibold mb-4">Comparison Result</h3>
      {getTotalStats(pokemon1) > getTotalStats(pokemon2) ? (
        <div className="text-green-600">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-lg font-bold">
            {PokemonService.getDisplayName(pokemon1, species1)} Wins!
          </div>
          <div className="text-sm text-muted mt-2">
            Total stats are {getTotalStats(pokemon1) - getTotalStats(pokemon2)} points higher
          </div>
        </div>
      ) : getTotalStats(pokemon1) < getTotalStats(pokemon2) ? (
        <div className="text-green-600">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-lg font-bold">
            {PokemonService.getDisplayName(pokemon2, species2)} Wins!
          </div>
          <div className="text-sm text-muted mt-2">
            Total stats are {getTotalStats(pokemon2) - getTotalStats(pokemon1)} points higher
          </div>
        </div>
      ) : (
        <div className="text-blue-600">
          <div className="text-3xl mb-2">🤝</div>
          <div className="text-lg font-bold">It's a Tie!</div>
          <div className="text-sm text-muted mt-2">
            Both Pokemon have the same total stats
          </div>
        </div>
      )}
    </div>
  );
}