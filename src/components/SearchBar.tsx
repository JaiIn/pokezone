import React from 'react';
import { useSearch } from '../hooks/usePokemon';

interface SearchBarProps {
  onPokemonSelect: (pokemonId: number) => void;
}

export function SearchBar({ onPokemonSelect }: SearchBarProps) {
  const { searchTerm, setSearchTerm, searchResult, searchLoading, searchError, clearSearch } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResult) {
      onPokemonSelect(searchResult.id);
      clearSearch();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="포켓몬 이름이나 번호를 입력하세요..."
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </form>

      {searchLoading && (
        <div className="mt-2 text-center text-gray-500">
          검색 중...
        </div>
      )}

      {searchError && (
        <div className="mt-2 text-center text-red-500 text-sm">
          {searchError}
        </div>
      )}

      {searchResult && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <img
              src={searchResult.sprites.front_default}
              alt={searchResult.name}
              className="w-16 h-16"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                #{searchResult.id.toString().padStart(3, '0')} {searchResult.name}
              </h3>
              <div className="flex space-x-2 mt-1">
                {searchResult.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type ${getTypeColor(type.type.name)}`}
                  >
                    {getTypeKoreanName(type.type.name)}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                onPokemonSelect(searchResult.id);
                clearSearch();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeColor(type: string): string {
  const typeColors: { [key: string]: string } = {
    normal: 'type-normal',
    fighting: 'type-fighting',
    flying: 'type-flying',
    poison: 'type-poison',
    ground: 'type-ground',
    rock: 'type-rock',
    bug: 'type-bug',
    ghost: 'type-ghost',
    steel: 'type-steel',
    fire: 'type-fire',
    water: 'type-water',
    grass: 'type-grass',
    electric: 'type-electric',
    psychic: 'type-psychic',
    ice: 'type-ice',
    dragon: 'type-dragon',
    dark: 'type-dark',
    fairy: 'type-fairy',
  };
  return typeColors[type] || 'type-normal';
}

function getTypeKoreanName(type: string): string {
  const typeNames: { [key: string]: string } = {
    normal: '노말',
    fighting: '격투',
    flying: '비행',
    poison: '독',
    ground: '땅',
    rock: '바위',
    bug: '벌레',
    ghost: '고스트',
    steel: '강철',
    fire: '불꽃',
    water: '물',
    grass: '풀',
    electric: '전기',
    psychic: '에스퍼',
    ice: '얼음',
    dragon: '드래곤',
    dark: '악',
    fairy: '페어리',
  };
  return typeNames[type] || type;
}
