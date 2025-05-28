import { useState } from 'react';
import { Move } from '../types';
import { PokemonService } from '../services/pokemonService';

export function useMoveDetails() {
  const [moveDetails, setMoveDetails] = useState<{ [key: string]: Move }>({});

  const loadMoveDetail = async (moveName: string) => {
    if (moveDetails[moveName]) return;

    try {
      const move = await PokemonService.getMove(moveName);
      setMoveDetails(prev => ({ ...prev, [moveName]: move }));
    } catch (error) {
      console.error(`기술 ${moveName} 정보 로드 실패:`, error);
    }
  };

  return {
    moveDetails,
    loadMoveDetail
  };
}
