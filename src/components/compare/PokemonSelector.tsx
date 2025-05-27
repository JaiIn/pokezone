import React, { useState } from 'react';
import { Pokemon } from '../../types/pokemon';
import { PokemonService } from '../../services/pokemonService';
import { useSearch } from '../../hooks/usePokemon';

interface PokemonSelectorProps {
  onSelect: (pokemon: Pokemon) => void;
  placeholder?: string;
}

export function PokemonSelector({ onSelect, placeholder = "Search for Pokemon" }: PokemonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResult, 
    searchSpecies,
    searchLoading, 
    searchError 
  } = useSearch();

  const handleSelect = (pokemon: Pokemon) => {
    onSelect(pokemon);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleRandomSelect = async () => {
    try {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      const pokemon = await PokemonService.getPokemon(randomId);
      handleSelect(pokemon);
    } catch (error) {
      console.error('Failed to load random Pokemon:', error);
    }
  };

  return (
    <div className="relative">
      <div className="card p-4 min-h-48 flex flex-col items-center justify-center">
        {!isOpen ? (
          <div className="text-center">
            <div className="text-6xl mb-4">❓</div>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-primary mb-2"
            >
              Select Pokemon
            </button>
            <button
              onClick={handleRandomSelect}
              className="btn-secondary text-sm"
            >
              Random Select
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="input-field"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {searchLoading && (
              <div className="text-center text-muted">
                Searching...
              </div>
            )}

            {searchError && (
              <div className="text-center text-red-500 text-sm">
                {searchError}
              </div>
            )}

            {searchResult && (
              <div className="border border-muted rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors">
                <div 
                  className="flex items-center space-x-3"
                  onClick={() => handleSelect(searchResult)}
                >
                  <img
                    src={searchResult.sprites.front_default}
                    alt={PokemonService.getDisplayName(searchResult, searchSpecies)}
                    className="w-16 h-16"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      #{PokemonService.formatPokemonId(searchResult.id)} {PokemonService.getDisplayName(searchResult, searchSpecies)}
                    </h4>
                    <div className="flex space-x-2 mt-1">
                      {searchResult.types.map((type) => (
                        <span
                          key={type.type.name}
                          className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                        >
                          {PokemonService.formatTypeName(type.type.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!searchTerm && !searchResult && (
              <div className="text-center text-muted">
                Enter Pokemon name or number
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
