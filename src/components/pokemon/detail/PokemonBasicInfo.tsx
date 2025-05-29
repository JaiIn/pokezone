import React, { useState } from 'react';
import { Pokemon, PokemonSpecies, PokemonType, PokemonStat } from '../../../types';
import { PokemonService } from '../../../services/pokemonService';
import { useLanguage } from '../../../contexts/LanguageContext';
import { AbilityItem } from './AbilityItem';
import { t } from '../../../utils/translations';

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
}

export function PokemonBasicInfo({ pokemon, species }: PokemonBasicInfoProps) {
  const { language } = useLanguage();
  const [isShiny, setIsShiny] = useState(false);
  const displayName = PokemonService.getDisplayName(pokemon, species, language);

  const getCurrentImage = () => {
    if (isShiny) {
      return pokemon.sprites.other['official-artwork']?.front_shiny || 
             pokemon.sprites.front_shiny || 
             pokemon.sprites.other['official-artwork']?.front_default || 
             pokemon.sprites.front_default;
    }
    return pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    if (isShiny && img.src !== pokemon.sprites.front_default) {
      img.src = pokemon.sprites.front_default;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Image and basic info */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <img
                src={getCurrentImage()}
                alt={displayName}
                className="w-64 h-64 object-contain mx-auto mb-4"
                onError={handleImageError}
              />
              
              {/* 이로치 토글 버튼 */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setIsShiny(!isShiny)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    isShiny 
                      ? 'bg-yellow-500 text-white shadow-lg' 
                      : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500'
                  }`}
                  title={isShiny ? t('normal_color', language) : t('shiny_pokemon', language)}
                >
                  {isShiny ? t('shiny', language) : t('normal', language)}
                </button>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              #{PokemonService.formatPokemonId(pokemon.id)} {displayName}
            </h2>
            {species && (
              <p className="text-muted text-sm leading-relaxed">
                {PokemonService.getFlavorText(species, language)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-4">{t('basic_info', language)}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">{t('height', language)}:</span>
                  <span>{(pokemon.height / 10).toFixed(1)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('weight', language)}:</span>
                  <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('base_experience', language)}:</span>
                  <span>{pokemon.base_experience}</span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-4">{t('type', language)}</h3>
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {pokemon.types.map((type: PokemonType) => (
                    <span
                      key={type.type.name}
                      className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                    >
                      {PokemonService.formatTypeName(type.type.name, language)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-4">{t('pokemon_forms', language)}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-slate-700">
                <img
                  src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={`${displayName} - ${t('normal', language)}`}
                  className="w-16 h-16 object-contain mb-1"
                />
                <span className="text-xs text-muted">{t('normal', language)}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
                <img
                  src={pokemon.sprites.other['official-artwork']?.front_shiny || pokemon.sprites.front_shiny || pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={`${displayName} - ${t('shiny', language)}`}
                  className="w-16 h-16 object-contain mb-1"
                />
                <span className="text-xs text-yellow-600 dark:text-yellow-400">{t('shiny', language)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Abilities and other info */}
        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">{t('abilities', language)}</h3>
            <div className="space-y-1">
              {pokemon.abilities.map((ability, index) => (
                <AbilityItem key={index} ability={ability} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats section - full width */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">{t('base_stats', language)}</h3>
        <div className="space-y-4">
          {pokemon.stats.map((stat: PokemonStat) => (
            <div key={stat.stat.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted">
                  {PokemonService.formatStatName(stat.stat.name, language)}
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
          {t('total_stats', language)}: {pokemon.stats.reduce((sum: number, stat: PokemonStat) => sum + stat.base_stat, 0)}
        </div>
      </div>
    </>
  );
}
