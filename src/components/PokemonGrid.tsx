import React from 'react';
import { PokemonListItem } from '../types/pokemon';
import { usePokemon } from '../hooks/usePokemon';
import { PokemonCard } from './PokemonCard';
import { LoadingSpinner } from './LoadingSpinner';

interface PokemonGridProps {
  pokemonList: PokemonListItem[];
  onPokemonClick: (pokemon: any) => void;
}

interface PokemonCardWrapperProps {
  pokemonItem: PokemonListItem;
  onPokemonClick: (pokemon: any) => void;
}

function PokemonCardWrapper({ pokemonItem, onPokemonClick }: PokemonCardWrapperProps) {
  const { pokemon, loading, error } = usePokemon(pokemonItem.name);

  if (loading) {
    return (
      <div className="pokemon-card flex items-center justify-center h-64">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="pokemon-card flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-lg">😕</div>
          <div className="text-sm mt-2">로드 실패</div>
        </div>
      </div>
    );
  }

  return (
    <PokemonCard
      pokemon={pokemon}
      onClick={() => onPokemonClick(pokemon)}
    />
  );
}

export function PokemonGrid({ pokemonList, onPokemonClick }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemonList.map((pokemonItem) => (
        <PokemonCardWrapper
          key={pokemonItem.name}
          pokemonItem={pokemonItem}
          onPokemonClick={onPokemonClick}
        />
      ))}
    </div>
  );
}
