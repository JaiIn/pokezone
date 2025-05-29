import React, { useState, useEffect } from 'react';
import { PokemonAbility } from '../../../types';
import { PokemonService } from '../../../services/pokemonService';
import { useLanguage } from '../../../contexts/LanguageContext';
import { t } from '../../../utils/translations';

interface AbilityItemProps {
  ability: PokemonAbility;
}

export function AbilityItem({ ability }: AbilityItemProps) {
  const { language } = useLanguage();
  const [localizedName, setLocalizedName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAbilityData = async () => {
      try {
        // 동기 버전으로 먼저 시도 (캐시된 데이터)
        const syncName = PokemonService.formatAbilityNameSync(ability.ability.name, language);
        setLocalizedName(syncName);

        // 비동기로 정확한 번역 로드
        const [asyncName, desc] = await Promise.all([
          PokemonService.formatAbilityNameAsync(ability.ability.name, language),
          PokemonService.getAbilityDescription(ability.ability.name, language)
        ]);

        setLocalizedName(asyncName);
        setDescription(desc);
      } catch (error) {
        console.warn(`Failed to load ability data for ${ability.ability.name}:`, error);
        setLocalizedName(PokemonService.formatAbilityName(ability.ability.name));
      } finally {
        setLoading(false);
      }
    };

    loadAbilityData();
  }, [ability.ability.name, language]);

  return (
    <div className="group relative">
      <div className="flex justify-between items-center py-2">
        <span className="text-muted">
          {ability.is_hidden ? `🔒 ${t('hidden_ability', language)}:` : `⚡ ${t('ability', language)}:`}
        </span>
        <div className="text-right">
          <span className="font-medium">
            {loading ? (
              <span className="animate-pulse bg-gray-200 dark:bg-slate-600 rounded px-2 py-1">
                Loading...
              </span>
            ) : (
              localizedName
            )}
          </span>
          {description && (
            <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-full mt-2 p-3 bg-white dark:bg-slate-700 border border-muted rounded-lg shadow-lg z-10 max-w-xs transition-opacity duration-200">
              <p className="text-sm text-muted leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
