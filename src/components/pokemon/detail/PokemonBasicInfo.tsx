import React from 'react';
import { Pokemon, PokemonSpecies, PokemonType, PokemonAbility, PokemonStat } from '../../../types';
import { PokemonService } from '../../../services/pokemonService';

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
}

export function PokemonBasicInfo({ pokemon, species }: PokemonBasicInfoProps) {
  const displayName = PokemonService.getDisplayName(pokemon, species);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Image and basic info */}
        <div className="space-y-6">
          <div className="text-center">
            <img
              src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={displayName}
              className="w-64 h-64 object-contain mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold mb-2">
              #{PokemonService.formatPokemonId(pokemon.id)} {displayName}
            </h2>
            {species && (
              <p className="text-muted text-sm leading-relaxed">
                {PokemonService.getFlavorText(species)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-4">Basic Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Height:</span>
                  <span>{(pokemon.height / 10).toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Weight:</span>
                  <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Base Experience:</span>
                  <span>{pokemon.base_experience}</span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-4">Type</h3>
              <div className="flex justify-between">
                <div className="flex space-x-1">
                  {pokemon.types.map((type: PokemonType) => (
                    <span
                      key={type.type.name}
                      className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                    >
                      {PokemonService.formatTypeName(type.type.name)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Abilities and other info */}
        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Abilities</h3>
            <div className="space-y-1">
              {pokemon.abilities.map((ability: PokemonAbility, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted">
                    {ability.is_hidden ? 'Hidden Ability:' : 'Ability:'}
                  </span>
                  <span className="font-medium">
                    {PokemonService.formatAbilityName(ability.ability.name)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats section - full width */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Base Stats</h3>
        <div className="space-y-4">
          {pokemon.stats.map((stat: PokemonStat) => (
            <div key={stat.stat.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted">
                  {PokemonService.formatStatName(stat.stat.name)}
                </span>
                <span className="font-bold">{stat.base_stat}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stat.base_stat / 200) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted">
          Total Stats: {pokemon.stats.reduce((sum: number, stat: PokemonStat) => sum + stat.base_stat, 0)}
        </div>
      </div>
    </>
  );
}
