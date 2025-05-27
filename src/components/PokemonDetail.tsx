import React, { useState, useEffect } from 'react';
import { Pokemon, PokemonSpecies, PokemonDetail as PokemonDetailType, Move } from '../types/pokemon';
import { PokemonService } from '../services/pokemonService';
import { TabNavigation, TabType } from './pokemon/detail/TabNavigation';
import { PokemonBasicInfo } from './pokemon/detail/PokemonBasicInfo';
import { EvolutionChain } from './pokemon/detail/EvolutionChain';
import { MovesList } from './pokemon/detail/MovesList';

interface PokemonDetailProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
  onClose: () => void;
  onPokemonSelect?: (pokemonId: number) => void;
}

export function PokemonDetail({ pokemon, species, onClose, onPokemonSelect }: PokemonDetailProps) {
  const [fullDetail, setFullDetail] = useState<PokemonDetailType | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('info');
  const [moveDetails, setMoveDetails] = useState<{ [key: string]: Move }>({});
  const [loading, setLoading] = useState(false);

  const koreanName = PokemonService.getKoreanName(pokemon, species);

  // 상세 정보 로드
  useEffect(() => {
    const loadFullDetail = async () => {
      setLoading(true);
      try {
        const detail = await PokemonService.getPokemonDetail(pokemon.id);
        setFullDetail(detail);
      } catch (error) {
        console.error('상세 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFullDetail();
  }, [pokemon.id]);

  // 진화 체인에서 포켓몬 선택 핸들러
  const handlePokemonSelect = async (pokemonName: string, pokemonId: string) => {
    if (onPokemonSelect) {
      onPokemonSelect(parseInt(pokemonId));
    }
  };

  // 기술 상세 정보 로드
  const loadMoveDetail = async (moveName: string) => {
    if (moveDetails[moveName]) return;

    try {
      const move = await PokemonService.getMove(moveName);
      setMoveDetails(prev => ({ ...prev, [moveName]: move }));
    } catch (error) {
      console.error(`기술 ${moveName} 정보 로드 실패:`, error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-muted">상세 정보를 로드하는 중...</p>
        </div>
      );
    }

    switch (selectedTab) {
      case 'info':
        return <PokemonBasicInfo pokemon={pokemon} species={species} />;
      case 'evolution':
        return <EvolutionChain fullDetail={fullDetail} onPokemonSelect={handlePokemonSelect} />;
      case 'moves':
        return <MovesList fullDetail={fullDetail} moveDetails={moveDetails} onLoadMoveDetail={loadMoveDetail} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="modal-backdrop flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="modal-content max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-muted p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            #{PokemonService.formatPokemonId(pokemon.id)} {koreanName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <TabNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} />

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
