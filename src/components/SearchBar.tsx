import React from 'react';
import { useSearch } from '../hooks/usePokemon';
import { PokemonService } from '../services/pokemonService';

interface SearchBarProps {
  onPokemonSelect: (pokemonId: number) => void;
}

export function SearchBar({ onPokemonSelect }: SearchBarProps) {
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResult, 
    searchSpecies,
    searchLoading, 
    searchError, 
    clearSearch 
  } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResult) {
      onPokemonSelect(searchResult.id);
      clearSearch();
    }
  };

  const koreanName = searchResult ? PokemonService.getKoreanName(searchResult, searchSpecies) : '';

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="포켓몬 이름이나 번호를 입력하세요..."
          className="input-field pr-12"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
          >
            ✕
          </button>
        )}
      </form>

      {searchLoading && (
        <div className="mt-2 text-center text-muted">
          검색 중...
        </div>
      )}

      {searchError && (
        <div className="mt-2 text-center text-red-500 text-sm">
          {searchError}
        </div>
      )}

      {searchResult && (
        <div className="mt-2 card p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <img
              src={searchResult.sprites.front_default}
              alt={koreanName}
              className="w-16 h-16"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                #{searchResult.id.toString().padStart(3, '0')} {koreanName}
              </h3>
              <div className="flex space-x-2 mt-1">
                {searchResult.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type ${PokemonService.getTypeColor(type.type.name)}`}
                  >
                    {PokemonService.getTypeKoreanName(type.type.name)}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                onPokemonSelect(searchResult.id);
                clearSearch();
              }}
              className="btn-primary"
            >
              선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
