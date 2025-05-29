import React from 'react';
import { Pokemon, PokemonSpecies } from '../../../types';
import { PokemonService } from '../../../services/pokemonService';
import { useLanguage } from '../../../contexts/LanguageContext';
import { t } from '../../../utils/translations';

interface BasicInfoComparisonProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  species1: PokemonSpecies | null;
  species2: PokemonSpecies | null;
}

export function BasicInfoComparison({ pokemon1, pokemon2, species1, species2 }: BasicInfoComparisonProps) {
  const { language } = useLanguage();

  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-6">{t('basic_information', language)}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-muted mb-2">{t('height', language)}</div>
          <div className="text-lg font-semibold">
            {(pokemon1.height / 10).toFixed(1)}m
          </div>
          <div className="text-xs text-muted">{t('vs', language)}</div>
          <div className="text-lg font-semibold">
            {(pokemon2.height / 10).toFixed(1)}m
          </div>
          <div className="text-xs mt-1">
            {pokemon1.height > pokemon2.height ? (
              <span className="text-green-600">{t('taller', language)}</span>
            ) : pokemon1.height < pokemon2.height ? (
              <span className="text-red-600">{t('shorter', language)}</span>
            ) : (
              <span className="text-blue-600">{t('same', language)}</span>
            )}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted mb-2">{t('weight', language)}</div>
          <div className="text-lg font-semibold">
            {(pokemon1.weight / 10).toFixed(1)}kg
          </div>
          <div className="text-xs text-muted">{t('vs', language)}</div>
          <div className="text-lg font-semibold">
            {(pokemon2.weight / 10).toFixed(1)}kg
          </div>
          <div className="text-xs mt-1">
            {pokemon1.weight > pokemon2.weight ? (
              <span className="text-green-600">{t('heavier', language)}</span>
            ) : pokemon1.weight < pokemon2.weight ? (
              <span className="text-red-600">{t('lighter', language)}</span>
            ) : (
              <span className="text-blue-600">{t('same', language)}</span>
            )}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted mb-2">{t('base_experience', language)}</div>
          <div className="text-lg font-semibold">{pokemon1.base_experience}</div>
          <div className="text-xs text-muted">{t('vs', language)}</div>
          <div className="text-lg font-semibold">{pokemon2.base_experience}</div>
          <div className="text-xs mt-1">
            {pokemon1.base_experience > pokemon2.base_experience ? (
              <span className="text-green-600">{t('higher', language)}</span>
            ) : pokemon1.base_experience < pokemon2.base_experience ? (
              <span className="text-red-600">{t('lower', language)}</span>
            ) : (
              <span className="text-blue-600">{t('same', language)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
