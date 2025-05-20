import { useState, useEffect } from 'react';
import { Pokemon, PokemonListItem, PokemonSpecies, PokemonListResponse, Generation, GENERATIONS } from '../types/pokemon';
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
        // 전체 세대
        response = await PokemonService.getPokemonList(limit, currentOffset);
      } else {
        // 특정 세대
        response = await PokemonService.getPokemonByGeneration(targetGeneration, limit, currentOffset);
      }
      
      if (isLoadMore) {
        // 중복 포켓몬 방지를 위해 고유한 포켓몬만 추가
        const existingNames = new Set(pokemonList.map(p => p.name));
        const newPokemons = response.results.filter(p => !existingNames.has(p.name));
        setPokemonList(prev => [...prev, ...newPokemons]);
      } else {
        setPokemonList(response.results);
      }
      
      setOffset(currentOffset + limit);
      
      // 다음 페이지 여부 확인 (next가 null이 아닐 때만 더 로드 가능)
      setHasMore(response.next !== null);
      
      // 현재 포켓몬 세대에서 더 로드할 포켓몬이 없는지 중복 확인
      const hasReachedEnd = response.results.length === 0 || 
                        (targetGeneration.id !== 0 && 
                         currentOffset + limit >= targetGeneration.endId - targetGeneration.startId + 1);
                         
      if (hasReachedEnd) {
        setHasMore(false);
      }
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

  const changeGeneration = (generation: Generation) => {
    setCurrentGeneration(generation);
    setOffset(0);
    setPokemonList([]);
    
    // 특정 세대를 선택했을 때는 해당 세대의 포켓몬 수를 고려하여 hasMore 설정
    if (generation.id !== 0) {
      // 전체 포켓몬 수가 limit보다 작을 때는 추가 로드 불가
      const totalPokemon = generation.endId - generation.startId + 1;
      setHasMore(totalPokemon > limit);
    } else {
      // 전체 세대를 선택했을 때는 항상 더 로드 가능
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
        
        // 이름이 pokemon-숫자 형태인 경우 숫자만 추출
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
          console.warn('종족 정보를 가져올 수 없습니다:', speciesError);
          setSpecies(null);
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
        
        // 검색 결과에 대한 species 정보도 로드
        try {
          const speciesData = await PokemonService.getPokemonSpecies(result.id);
          setSearchSpecies(speciesData);
        } catch (speciesError) {
          setSearchSpecies(null);
        }
      } else {
        setSearchError(`"${query}"와(과) 일치하는 포켓몬을 찾을 수 없습니다.`);
        setSearchResult(null);
        setSearchSpecies(null);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
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
