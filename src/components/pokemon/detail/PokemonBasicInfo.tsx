import React from 'react';
import { Pokemon, PokemonSpecies } from '../../../types/pokemon';
import { PokemonService } from '../../../services/pokemonService';

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
}

export function PokemonBasicInfo({ pokemon, species }: PokemonBasicInfoProps) {
  const displayName = PokemonService.getDisplayName(pokemon, species);
  const flavorText = species ? PokemonService.getFlavorText(species) : '';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 이미지 섹션 */}
        <div className="text-center">
          <img
            src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
            alt={displayName}
            className="w-64 h-64 object-contain mx-auto mb-4"
          />
          <div className="flex justify-center space-x-4">
            <img
              src={pokemon.sprites.front_default}
              alt={`${displayName} normal`}
              className="w-16 h-16 border border-muted rounded"
            />
            {pokemon.sprites.front_shiny && (
              <img
                src={pokemon.sprites.front_shiny}
                alt={`${displayName} shiny`}
                className="w-16 h-16 border border-muted rounded"
              />
            )}
          </div>
        </div>

        {/* 기본 정보 섹션 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">Name:</span>
                <span className="capitalize">{displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Type:</span>
                <div className="flex space-x-1">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                    >
                      {PokemonService.formatTypeName(type.type.name)}
                    </span>
                  ))}
                </div>
              </div>
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

          {/* Abilities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Abilities</h3>
            <div className="space-y-1">
              {pokemon.abilities.map((ability, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted">
                    {ability.is_hidden ? 'Hidden Ability:' : 'Ability:'}
                  </span>
                  <span className="capitalize">{PokemonService.formatAbilityName(ability.ability.name)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {flavorText && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{flavorText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Base Stats</h3>
        <div className="space-y-4">
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted">
                  {PokemonService.formatStatName(stat.stat.name)}
                </span>
                <span className="font-semibold">{stat.base_stat}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stat.base_stat / 200) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted">
          Total Stats: {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
        </div>
      </div>
    </>
  );
}
