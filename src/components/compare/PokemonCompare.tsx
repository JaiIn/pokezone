import React, { useState } from 'react';
import { Pokemon, PokemonSpecies } from '../../types';
import { PokemonService } from '../../services/pokemonService';
import { PokemonSelectionCard } from './detail/PokemonSelectionCard';
import { BasicInfoComparison } from './detail/BasicInfoComparison';
import { StatsComparison } from './detail/StatsComparison';
import { ComparisonResult } from './detail/ComparisonResult';

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
        console.error('Failed to load species data for pokemon 1');
        setSpecies1(null);
      }
    } else {
      setPokemon2(pokemon);
      try {
        const speciesData = await PokemonService.getPokemonSpecies(pokemon.id);
        setSpecies2(speciesData);
      } catch (error) {
        console.error('Failed to load species data for pokemon 2');
        setSpecies2(null);
      }
    }
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
            <PokemonSelectionCard
              pokemon={pokemon1}
              species={species1}
              position={1}
              title="First Pokemon"
              placeholder="Select first Pokemon"
              onSelect={(pokemon) => handlePokemonSelect(pokemon, 1)}
              onClear={() => setPokemon1(null)}
            />

            <PokemonSelectionCard
              pokemon={pokemon2}
              species={species2}
              position={2}
              title="Second Pokemon"
              placeholder="Select second Pokemon"
              onSelect={(pokemon) => handlePokemonSelect(pokemon, 2)}
              onClear={() => setPokemon2(null)}
            />
          </div>

          {pokemon1 && pokemon2 && (
            <div className="space-y-8">
              <BasicInfoComparison
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                species1={species1}
                species2={species2}
              />

              <StatsComparison
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                species1={species1}
                species2={species2}
              />

              <ComparisonResult
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                species1={species1}
                species2={species2}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
