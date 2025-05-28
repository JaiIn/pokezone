import React, { useState } from 'react';
import { usePokemonList, usePokemon } from '../hooks/usePokemon';
import { Pokemon } from '../types';
import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { GenerationSelector } from './GenerationSelector';
import { PokemonGrid } from './PokemonGrid';
import { PokemonDetail } from './PokemonDetail';
import { PokemonCompare } from './compare/PokemonCompare';
import { PokemonWorldCup } from './worldcup/PokemonWorldCup';
import { ThemeToggle } from './ThemeToggle';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

type ActiveModal = 'detail' | 'compare' | 'worldcup' | null;

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
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const { pokemon: detailPokemon, species, loading: detailLoading } = usePokemon(
    selectedPokemon ? selectedPokemon.id : null
  );

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setActiveModal('detail');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedPokemon(null);
  };

  const handleSearchSelect = (pokemonId: number) => {
    setSelectedPokemon({ id: pokemonId } as Pokemon);
    setActiveModal('detail');
  };

  const handlePokemonSelectFromEvolution = (pokemonId: number) => {
    setSelectedPokemon({ id: pokemonId } as Pokemon);
    // 날짜 모달을 닫았다가 새로운 포켓몬으로 다시 열기
    setActiveModal(null);
    setTimeout(() => {
      setActiveModal('detail');
    }, 100);
  };

  const handleGenerationChange = (generation: any) => {
    changeGeneration(generation);
  };

  const handleCompareClick = () => {
    setActiveModal('compare');
  };

  const handleWorldCupClick = () => {
    setActiveModal('worldcup');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <ThemeToggle />
      <Header />
      
      <div className="container mx-auto px-4">
        <SearchBar onPokemonSelect={handleSearchSelect} />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <GenerationSelector 
            selectedGeneration={currentGeneration}
            onGenerationChange={handleGenerationChange}
          />
          
          <div className="flex space-x-3">
            <button
              onClick={handleCompareClick}
              className="btn-primary flex items-center space-x-2"
            >
              <span>⚔️</span>
              <span>Pokemon Compare</span>
            </button>
            <button
              onClick={handleWorldCupClick}
              className="btn-secondary flex items-center space-x-2"
            >
              <span>🏆</span>
              <span>World Cup</span>
            </button>
          </div>
        </div>
        
        {error ? (
          <ErrorMessage message={error} onRetry={reset} />
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-slate-300">
                {currentGeneration.koreanName}
              </h2>
              {currentGeneration.id !== 0 && (
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                  #{currentGeneration.startId} - #{currentGeneration.endId}
                </p>
              )}
            </div>
            
            <PokemonGrid 
              pokemonList={pokemonList} 
              onPokemonClick={handlePokemonClick}
            />
            
            {loading && (
              <LoadingSpinner message="Loading Pokemon..." />
            )}
            
            {!loading && hasMore && pokemonList.length > 0 && (
              <div className="text-center mt-8 mb-8">
                <button
                  onClick={loadMore}
                  className="btn-primary"
                >
                  Load More Pokemon ({pokemonList.length}/{currentGeneration.id === 0 ? 1025 : currentGeneration.endId - currentGeneration.startId + 1})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 모달들 */}
      {activeModal === 'detail' && selectedPokemon && (
        <>
          {detailLoading ? (
            <div className="modal-backdrop flex items-center justify-center z-50">
              <div className="modal-content p-8">
                <LoadingSpinner message="Loading Pokemon information..." />
              </div>
            </div>
          ) : detailPokemon ? (
            <PokemonDetail
              pokemon={detailPokemon}
              species={species}
              onClose={handleCloseModal}
              onPokemonSelect={handlePokemonSelectFromEvolution}
            />
          ) : null}
        </>
      )}

      {activeModal === 'compare' && (
        <PokemonCompare
          onClose={handleCloseModal}
          initialPokemon={selectedPokemon || undefined}
        />
      )}

      {activeModal === 'worldcup' && (
        <PokemonWorldCup onClose={handleCloseModal} />
      )}
      
      <footer className="bg-gray-800 dark:bg-slate-900 text-white py-8 mt-16 border-t border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 dark:text-slate-400">
            Data provided by: <a href="https://pokeapi.co/" className="text-blue-400 hover:text-blue-300">PokeAPI</a>
          </p>
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-2">
            This app was created using PokeAPI.
          </p>
        </div>
      </footer>
    </div>
  );
}
