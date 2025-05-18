import { useState, useEffect } from 'react';
import { Pokemon, PokemonListItem, PokemonSpecies } from '../types/pokemon';
import { PokemonService } from '../services/pokemonService';

export function usePokemonList(limit: number = 20) {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPokemon = async (isLoadMore = false) => {
    setLoading(true);
    setError(null);

    try {
      const currentOffset = isLoadMore ? offset : 0;
      const response = await PokemonService.getPokemonList(limit, currentOffset);
      
      if (isLoadMore) {
        setPokemonList(prev => [...prev, ...response.results]);
      } else {
        setPokemonList(response.results);
      }
      
      setOffset(currentOffset + limit);
      setHasMore(response.next !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPokemon(true);
    }
  };

  const reset = () => {
    setOffset(0);
    setPokemonList([]);
    setHasMore(true);
    loadPokemon(false);
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  return {
    pokemonList,
    loading,
    error,
    hasMore,
    loadMore,
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
        const pokemonData = await PokemonService.getPokemon(nameOrId);
        setPokemon(pokemonData);

        try {
          const speciesData = await PokemonService.getPokemonSpecies(pokemonData.id);
          setSpecies(speciesData);
        } catch (speciesError) {
          console.warn('종족 정보를 가져올 수 없습니다:', speciesError);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
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
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setSearchResult(null);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const result = await PokemonService.searchPokemon(query.trim());
      if (result) {
        setSearchResult(result);
      } else {
        setSearchError(`"${query}"와(과) 일치하는 포켓몬을 찾을 수 없습니다.`);
        setSearchResult(null);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
    setSearchError(null);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        search(searchTerm);
      } else {
        setSearchResult(null);
        setSearchError(null);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResult,
    searchLoading,
    searchError,
    clearSearch,
  };
}
