import React from 'react';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { PokemonService } from '../services/pokemonService';

interface PokemonCardProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
  onClick: () => void;
}

export function PokemonCard({ pokemon, species, onClick }: PokemonCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    if (img.src !== pokemon.sprites.front_default) {
      img.src = pokemon.sprites.front_default;
    }
  };

  const displayName = PokemonService.getDisplayName(pokemon, species);

  return (
    <div
      className="pokemon-card cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative p-6">
        <div className="text-right text-gray-400 text-sm font-semibold mb-2">
          #{PokemonService.formatPokemonId(pokemon.id)}
        </div>
        
        <div className="flex justify-center mb-4">
          <img
            src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
            alt={displayName}
            className="w-24 h-24 object-contain"
            onError={handleImageError}
          />
        </div>
        
        <h3 className="text-xl font-bold text-center mb-2">
          {displayName}
        </h3>
        
        <div className="flex flex-wrap justify-center gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`pokemon-type ${PokemonService.getTypeColor(type.type.name)}`}
            >
              {PokemonService.formatTypeName(type.type.name)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
