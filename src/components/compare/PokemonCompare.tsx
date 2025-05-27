import React, { useState } from 'react';
import { Pokemon, PokemonSpecies } from '../../types/pokemon';
import { PokemonService } from '../../services/pokemonService';
import { PokemonSelector } from './PokemonSelector';

interface PokemonCompareProps {
  onClose: () => void;
  initialPokemon?: Pokemon;
}

export function PokemonCompare({ onClose, initialPokemon }: PokemonCompareProps) {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(initialPokemon || null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [species1, setSpecies1] = useState<PokemonSpecies | null>(null);
  const [species2, setSpecies2] = useState<PokemonSpecies | null>(null);

  const handlePokemonSelect = async (pokemon: Pokemon, position: 1 | 2) => {
    if (position === 1) {
      setPokemon1(pokemon);
      try {
        const speciesData = await PokemonService.getPokemonSpecies(pokemon.id);
        setSpecies1(speciesData);
      } catch (error) {
        setSpecies1(null);
      }
    } else {
      setPokemon2(pokemon);
      try {
        const speciesData = await PokemonService.getPokemonSpecies(pokemon.id);
        setSpecies2(speciesData);
      } catch (error) {
        setSpecies2(null);
      }
    }
  };

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
    return pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  };

  return (
    <div className="modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="modal-content max-w-6xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-muted p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Pokemon Comparison ⚔️</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Pokemon 1 Selection */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">First Pokemon</h3>
              {pokemon1 ? (
                <div className="card p-4">
                  <img
                    src={pokemon1.sprites.other['official-artwork']?.front_default || pokemon1.sprites.front_default}
                    alt={PokemonService.getDisplayName(pokemon1, species1)}
                    className="w-32 h-32 object-contain mx-auto mb-4"
                  />
                  <h4 className="text-xl font-bold">
                    #{PokemonService.formatPokemonId(pokemon1.id)} {PokemonService.getDisplayName(pokemon1, species1)}
                  </h4>
                  <div className="flex justify-center space-x-2 mt-2">
                    {pokemon1.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                      >
                        {PokemonService.formatTypeName(type.type.name)}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setPokemon1(null)}
                    className="mt-4 text-sm text-blue-500 hover:text-blue-700"
                  >
                    Select Different Pokemon
                  </button>
                </div>
              ) : (
                <PokemonSelector
                  onSelect={(pokemon) => handlePokemonSelect(pokemon, 1)}
                  placeholder="Select first Pokemon"
                />
              )}
            </div>

            {/* Pokemon 2 Selection */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Second Pokemon</h3>
              {pokemon2 ? (
                <div className="card p-4">
                  <img
                    src={pokemon2.sprites.other['official-artwork']?.front_default || pokemon2.sprites.front_default}
                    alt={PokemonService.getDisplayName(pokemon2, species2)}
                    className="w-32 h-32 object-contain mx-auto mb-4"
                  />
                  <h4 className="text-xl font-bold">
                    #{PokemonService.formatPokemonId(pokemon2.id)} {PokemonService.getDisplayName(pokemon2, species2)}
                  </h4>
                  <div className="flex justify-center space-x-2 mt-2">
                    {pokemon2.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                      >
                        {PokemonService.formatTypeName(type.type.name)}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setPokemon2(null)}
                    className="mt-4 text-sm text-blue-500 hover:text-blue-700"
                  >
                    Select Different Pokemon
                  </button>
                </div>
              ) : (
                <PokemonSelector
                  onSelect={(pokemon) => handlePokemonSelect(pokemon, 2)}
                  placeholder="Select second Pokemon"
                />
              )}
            </div>
          </div>

          {/* Comparison Results */}
          {pokemon1 && pokemon2 && (
            <div className="space-y-8">
              {/* Basic Info Comparison */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-6">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted mb-2">Height</div>
                    <div className="text-lg font-semibold">
                      {(pokemon1.height / 10).toFixed(1)}m
                    </div>
                    <div className="text-xs text-muted">vs</div>
                    <div className="text-lg font-semibold">
                      {(pokemon2.height / 10).toFixed(1)}m
                    </div>
                    <div className="text-xs mt-1">
                      {pokemon1.height > pokemon2.height ? (
                        <span className="text-green-600">Taller</span>
                      ) : pokemon1.height < pokemon2.height ? (
                        <span className="text-red-600">Shorter</span>
                      ) : (
                        <span className="text-blue-600">Same</span>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted mb-2">Weight</div>
                    <div className="text-lg font-semibold">
                      {(pokemon1.weight / 10).toFixed(1)}kg
                    </div>
                    <div className="text-xs text-muted">vs</div>
                    <div className="text-lg font-semibold">
                      {(pokemon2.weight / 10).toFixed(1)}kg
                    </div>
                    <div className="text-xs mt-1">
                      {pokemon1.weight > pokemon2.weight ? (
                        <span className="text-green-600">Heavier</span>
                      ) : pokemon1.weight < pokemon2.weight ? (
                        <span className="text-red-600">Lighter</span>
                      ) : (
                        <span className="text-blue-600">Same</span>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted mb-2">Base Experience</div>
                    <div className="text-lg font-semibold">{pokemon1.base_experience}</div>
                    <div className="text-xs text-muted">vs</div>
                    <div className="text-lg font-semibold">{pokemon2.base_experience}</div>
                    <div className="text-xs mt-1">
                      {pokemon1.base_experience > pokemon2.base_experience ? (
                        <span className="text-green-600">Higher</span>
                      ) : pokemon1.base_experience < pokemon2.base_experience ? (
                        <span className="text-red-600">Lower</span>
                      ) : (
                        <span className="text-blue-600">Same</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Comparison */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-6">Stats Comparison</h3>
                <div className="space-y-4">
                  {pokemon1.stats.map((stat1, index) => {
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
                  
                  {/* Total Stats */}
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

              {/* Battle Result */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}