import React from 'react';
import { Pokemon, PokemonSpecies, PokemonStat } from '../../../types';
import { PokemonService } from '../../../services/pokemonService';

interface StatsComparisonProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  species1: PokemonSpecies | null;
  species2: PokemonSpecies | null;
}

export function StatsComparison({ pokemon1, pokemon2, species1, species2 }: StatsComparisonProps) {
  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return 'higher';
    if (stat1 < stat2) return 'lower';
    return 'equal';
  };

  const getStatBarColor = (comparison: string) => {
    switch (comparison) {
      case 'higher': return 'bg-green-500';
      case 'lower': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getTotalStats = (pokemon: Pokemon) => {
    return pokemon.stats.reduce((sum: number, stat: PokemonStat) => sum + stat.base_stat, 0);
  };

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-6">Stats Comparison</h3>
      <div className="space-y-4">
        {pokemon1.stats.map((stat1: PokemonStat, index: number) => {
          const stat2 = pokemon2.stats[index];
          const comparison1 = getStatComparison(stat1.base_stat, stat2.base_stat);
          const comparison2 = getStatComparison(stat2.base_stat, stat1.base_stat);
          
          return (
            <div key={stat1.stat.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {PokemonService.formatStatName(stat1.stat.name)}
                </span>
                <div className="flex space-x-4 text-sm">
                  <span className={`font-semibold ${
                    comparison1 === 'higher' ? 'text-green-600' : 
                    comparison1 === 'lower' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {stat1.base_stat}
                  </span>
                  <span className="text-muted">vs</span>
                  <span className={`font-semibold ${
                    comparison2 === 'higher' ? 'text-green-600' : 
                    comparison2 === 'lower' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {stat2.base_stat}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStatBarColor(comparison1)}`}
                      style={{ width: `${Math.min(100, (stat1.base_stat / 200) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getStatBarColor(comparison2)}`}
                      style={{ width: `${Math.min(100, (stat2.base_stat / 200) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="mt-6 pt-4 border-t border-muted">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Stats</span>
            <div className="flex space-x-4 text-lg">
              <span className={`font-bold ${
                getTotalStats(pokemon1) > getTotalStats(pokemon2) ? 'text-green-600' :
                getTotalStats(pokemon1) < getTotalStats(pokemon2) ? 'text-red-600' : 'text-blue-600'
              }`}>
                {getTotalStats(pokemon1)}
              </span>
              <span className="text-muted">vs</span>
              <span className={`font-bold ${
                getTotalStats(pokemon2) > getTotalStats(pokemon1) ? 'text-green-600' :
                getTotalStats(pokemon2) < getTotalStats(pokemon1) ? 'text-red-600' : 'text-blue-600'
              }`}>
                {getTotalStats(pokemon2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
