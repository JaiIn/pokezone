import React, { useState } from 'react';
import { usePokemonList, usePokemon } from '../hooks/usePokemon';
import { Pokemon } from '../types/pokemon';
import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { GenerationSelector } from './GenerationSelector';
import { PokemonGrid } from './PokemonGrid';
import { PokemonDetail } from './PokemonDetail';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function PokemonDex() {
  const { 
    pokemonList, 
    loading, 
    error, 
    hasMore, 
    currentGeneration,
    loadMore, 
    changeGeneration,
    reset 
  } = usePokemonList(20);
  
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const { pokemon: detailPokemon, species, loading: detailLoading } = usePokemon(
    selectedPokemon ? selectedPokemon.id : null
  );

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  const handleSearchSelect = (pokemonId: number) => {
    // 검색에서 선택된 포켓몬의 상세 정보를 로드하기 위해 임시 Pokemon 객체 생성
    setSelectedPokemon({ id: pokemonId } as Pokemon);
  };

  const handleGenerationChange = (generation: any) => {
    changeGeneration(generation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4">
        <SearchBar onPokemonSelect={handleSearchSelect} />
        
        <GenerationSelector 
          selectedGeneration={currentGeneration}
          onGenerationChange={handleGenerationChange}
        />
        
        {error ? (
          <ErrorMessage message={error} onRetry={reset} />
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                {currentGeneration.koreanName}
              </h2>
              {currentGeneration.id !== 0 && (
                <p className="text-gray-500 text-sm mt-1">
                  #{currentGeneration.startId} - #{currentGeneration.endId}
                </p>
              )}
            </div>
            
            <PokemonGrid 
              pokemonList={pokemonList} 
              onPokemonClick={handlePokemonClick}
            />
            
            {loading && (
              <LoadingSpinner message="포켓몬을 불러오는 중..." />
            )}
            
            {!loading && hasMore && pokemonList.length > 0 && (
              <div className="text-center mt-8 mb-8">
                <button
                  onClick={loadMore}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
                >
                  더 많은 포켓몬 보기
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPokemon && (
        <>
          {detailLoading ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8">
                <LoadingSpinner message="포켓몬 정보를 불러오는 중..." />
              </div>
            </div>
          ) : detailPokemon ? (
            <PokemonDetail
              pokemon={detailPokemon}
              species={species}
              onClose={handleCloseDetail}
            />
          ) : null}
        </>
      )}
      
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            데이터 제공: <a href="https://pokeapi.co/" className="text-blue-400 hover:text-blue-300">PokeAPI</a>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            이 앱은 PokeAPI를 사용하여 제작되었습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
