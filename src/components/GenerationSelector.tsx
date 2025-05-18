import React from 'react';
import { Generation, GENERATIONS } from '../types/pokemon';

interface GenerationSelectorProps {
  selectedGeneration: Generation;
  onGenerationChange: (generation: Generation) => void;
}

export function GenerationSelector({ selectedGeneration, onGenerationChange }: GenerationSelectorProps) {
  return (
    <div className="w-full max-w-xs mx-auto mb-6">
      <label htmlFor="generation-select" className="block text-sm font-medium text-gray-700 mb-2">
        세대 선택
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
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        {GENERATIONS.map((generation) => (
          <option key={generation.id} value={generation.id}>
            {generation.koreanName}
          </option>
        ))}
      </select>
    </div>
  );
}
