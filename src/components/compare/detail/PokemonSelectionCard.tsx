import React from 'react';
import { Pokemon, PokemonSpecies, PokemonType } from '../../../types';
import { PokemonService } from '../../../services/pokemonService';
import { PokemonSelector } from '../PokemonSelector';
import { useLanguage } from '../../../contexts/LanguageContext';
import { t } from '../../../utils/translations';

interface PokemonSelectionCardProps {
  pokemon: Pokemon | null;
  species: PokemonSpecies | null;
  position: 1 | 2;
  title: string;
  placeholder: string;
  onSelect: (pokemon: Pokemon) => void;
  onClear: () => void;
}

export function PokemonSelectionCard({
  pokemon,
  species,
  position,
  title,
  placeholder,
  onSelect,
  onClear
}: PokemonSelectionCardProps) {
  const { language } = useLanguage();

  if (pokemon) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="card p-4">
          <img
            src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
            alt={PokemonService.getDisplayName(pokemon, species, language)}
            className="w-32 h-32 object-contain mx-auto mb-4"
          />
          <h4 className="text-xl font-bold">
            #{PokemonService.formatPokemonId(pokemon.id)} {PokemonService.getDisplayName(pokemon, species, language)}
          </h4>
          <div className="flex justify-center space-x-2 mt-2">
            {pokemon.types.map((type: PokemonType) => (
              <span
                key={type.type.name}
                className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
              >
                {PokemonService.formatTypeName(type.type.name, language)}
              </span>
            ))}
          </div>
          <button
            onClick={onClear}
            className="mt-4 text-sm text-blue-500 hover:text-blue-700"
          >
            {t('select_different_pokemon', language)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <PokemonSelector
        onSelect={onSelect}
        placeholder={placeholder}
      />
    </div>
  );
}
