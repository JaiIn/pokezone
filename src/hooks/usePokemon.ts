import { useState, useEffect } from 'react';
import { Pokemon, PokemonListItem, PokemonSpecies, PokemonListResponse, Generation, GENERATIONS } from '../types';
import { PokemonService } from '../services/pokemonService';

export function usePokemonList(limit: number = 20, selectedGeneration?: Generation) {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentGeneration, setCurrentGeneration] = useState<Generation>(
    selectedGeneration || GENERATIONS[0]
  );

  const loadPokemon = async (isLoadMore = false, generation?: Generation) => {
    setLoading(true);
    setError(null);

    try {
      const targetGeneration = generation || currentGeneration;
      const currentOffset = isLoadMore ? offset : 0;
      
      let response: PokemonListResponse;
      if (targetGeneration.id === 0) {
        // All generations
        response = await PokemonService.getPokemonList(limit, currentOffset);
      } else {
        // Specific generation
        response = await PokemonService.getPokemonByGeneration(targetGeneration, limit, currentOffset);
      }
      
      if (isLoadMore) {
        // Prevent duplicate Pokemon by adding only unique ones
        const existingNames = new Set(pokemonList.map(p => p.name));
        const newPokemons = response.results.filter(p => !existingNames.has(p.name));
        setPokemonList(prev => [...prev, ...newPokemons]);
      } else {
        setPokemonList(response.results);
      }
      
      setOffset(currentOffset + limit);
      
      // Check if more pages exist (only when next is not null)
      setHasMore(response.next !== null);
      
      // Double check if there are no more Pokemon to load in current generation
      const hasReachedEnd = response.results.length === 0 || 
                        (targetGeneration.id !== 0 && 
                         currentOffset + limit >= targetGeneration.endId - targetGeneration.startId + 1);
                         
      if (hasReachedEnd) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPokemon(true);
    }
  };

  const changeGeneration = (generation: Generation) => {
    setCurrentGeneration(generation);
    setOffset(0);
    setPokemonList([]);
    
    // When selecting a specific generation, consider the number of Pokemon in that generation to set hasMore
    if (generation.id !== 0) {
      // When total Pokemon count is less than limit, no additional loading possible
      const totalPokemon = generation.endId - generation.startId + 1;
      setHasMore(totalPokemon > limit);
    } else {
      // When all generations are selected, always allow more loading
      setHasMore(true);
    }
    
    loadPokemon(false, generation);
  };

  const reset = () => {
    setOffset(0);
    setPokemonList([]);
    setHasMore(true);
    loadPokemon(false);
  };

  useEffect(() => {
    loadPokemon(false, currentGeneration);
  }, []);

  return {
    pokemonList,
    loading,
    error,
    hasMore,
    currentGeneration,
    loadMore,
    changeGeneration,
    reset,
  };
}

export function usePokemon(nameOrId: string | number | null) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nameOrId) {
      setPokemon(null);
      setSpecies(null);
      return;
    }

    const loadPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        let pokemonData: Pokemon;
        
        // If name is in pokemon-number format, extract only the number
        if (typeof nameOrId === 'string' && nameOrId.startsWith('pokemon-')) {
          const id = nameOrId.replace('pokemon-', '');
          pokemonData = await PokemonService.getPokemon(id);
        } else {
          pokemonData = await PokemonService.getPokemon(nameOrId);
        }
        
        setPokemon(pokemonData);

        try {
          const speciesData = await PokemonService.getPokemonSpecies(pokemonData.id);
          setSpecies(speciesData);
        } catch (speciesError) {
          console.warn('Unable to fetch species information:', speciesError);
          setSpecies(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setPokemon(null);
        setSpecies(null);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [nameOrId]);

  return {
    pokemon,
    species,
    loading,
    error,
  };
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
  const [searchSpecies, setSearchSpecies] = useState<PokemonSpecies | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResult(null);
      setSearchSpecies(null);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const result = await PokemonService.searchPokemon(query.trim());
      if (result) {
        setSearchResult(result);
        
        // Load species information for search result as well
        try {
          const speciesData = await PokemonService.getPokemonSpecies(result.id);
          setSearchSpecies(speciesData);
        } catch (speciesError) {
          setSearchSpecies(null);
        }
      } else {
        setSearchError(`No Pokemon found matching "${query}".`);
        setSearchResult(null);
        setSearchSpecies(null);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'An error occurred during search.');
      setSearchResult(null);
      setSearchSpecies(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
    setSearchSpecies(null);
    setSearchError(null);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        search(searchTerm);
      } else {
        setSearchResult(null);
        setSearchSpecies(null);
        setSearchError(null);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResult,
    searchSpecies,
    searchLoading,
    searchError,
    clearSearch,
  };
}
