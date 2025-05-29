import React from 'react';
import { Generation, GENERATIONS } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/translations';

interface GenerationSelectorProps {
  selectedGeneration: Generation;
  onGenerationChange: (generation: Generation) => void;
}

export function GenerationSelector({ selectedGeneration, onGenerationChange }: GenerationSelectorProps) {
  const { language } = useLanguage();
  
  return (
    <div className="w-full max-w-xs mx-auto mb-6">
      <label htmlFor="generation-select" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
        {t('generation_select', language)}
      </label>
      <select
        id="generation-select"
        value={selectedGeneration.id}
        onChange={(e) => {
          const generationId = parseInt(e.target.value);
          const generation = GENERATIONS.find(gen => gen.id === generationId);
          if (generation) {
            onGenerationChange(generation);
          }
        }}
        className="select-field"
      >
        {GENERATIONS.map((generation) => {
          let displayName = generation.koreanName; // 기본값
          if (language === 'en') displayName = generation.englishName;
          else if (language === 'ja') displayName = generation.japaneseName;
          
          return (
            <option key={generation.id} value={generation.id}>
              {displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
}
