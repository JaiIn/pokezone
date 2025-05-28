import React from 'react';
import { Pokemon, PokemonType } from '../../types';
import { PokemonService } from '../../services/pokemonService';

interface PokemonBattleCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
}

export function PokemonBattleCard({ pokemon, onSelect }: PokemonBattleCardProps) {
  return (
    <div className="text-center">
      <button
        onClick={() => onSelect(pokemon)}
        className="w-full p-6 rounded-lg border-2 border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700"
      >
        <img
          src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={PokemonService.getDisplayName(pokemon)}
          className="w-40 h-40 object-contain mx-auto mb-4"
        />
        <h3 className="text-xl font-bold mb-2">
          {PokemonService.getDisplayName(pokemon)}
        </h3>
        <div className="flex justify-center space-x-2">
          {pokemon.types.map((type: PokemonType) => (
            <span
              key={type.type.name}
              className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
            >
              {PokemonService.formatTypeName(type.type.name)}
            </span>
          ))}
        </div>
        <div className="mt-3 text-sm text-muted">
          #{PokemonService.formatPokemonId(pokemon.id)}
        </div>
      </button>
    </div>
  );
}
