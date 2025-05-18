import React, { useState, useEffect } from 'react';
import { Pokemon } from '../../types/pokemon';
import { PokemonService } from '../../services/pokemonService';
import { LoadingSpinner } from '../LoadingSpinner';

interface PokemonWorldCupProps {
  onClose: () => void;
}

interface MatchPair {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
}

export function PokemonWorldCup({ onClose }: PokemonWorldCupProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [participants, setParticipants] = useState<Pokemon[]>([]);
  const [winners, setWinners] = useState<Pokemon[]>([]);
  const [currentPair, setCurrentPair] = useState<MatchPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [champion, setChampion] = useState<Pokemon | null>(null);
  const [roundName, setRoundName] = useState('');

  const totalRounds = Math.log2(16); // 16강부터 시작

  useEffect(() => {
    initializeTournament();
  }, []);

  useEffect(() => {
    updateRoundName();
  }, [currentRound, participants]);

  const initializeTournament = async () => {
    setLoading(true);
    try {
      // 랜덤한 16마리 포켓몬 선택 (1~151 사이에서)
      const pokemonIds = [];
      const usedIds = new Set();
      
      while (pokemonIds.length < 16) {
        const id = Math.floor(Math.random() * 151) + 1;
        if (!usedIds.has(id)) {
          pokemonIds.push(id);
          usedIds.add(id);
        }
      }

      const pokemonPromises = pokemonIds.map(id => PokemonService.getPokemon(id));
      const pokemonList = await Promise.all(pokemonPromises);
      
      setParticipants(pokemonList);
      setCurrentPair({
        pokemon1: pokemonList[0],
        pokemon2: pokemonList[1]
      });
    } catch (error) {
      console.error('토너먼트 초기화 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRoundName = () => {
    const remaining = participants.length;
    if (remaining === 16) setRoundName('16강');
    else if (remaining === 8) setRoundName('8강');
    else if (remaining === 4) setRoundName('준결승');
    else if (remaining === 2) setRoundName('결승');
    else setRoundName('');
  };

  const handlePokemonSelect = (selectedPokemon: Pokemon) => {
    const newWinners = [...winners, selectedPokemon];
    const nextMatchIndex = currentMatch + 1;
    const pairIndex = nextMatchIndex * 2;

    if (pairIndex + 1 < participants.length) {
      // 다음 매치로
      setCurrentMatch(nextMatchIndex);
      setCurrentPair({
        pokemon1: participants[pairIndex],
        pokemon2: participants[pairIndex + 1]
      });
      setWinners(newWinners);
    } else {
      // 라운드 완료
      if (newWinners.length === 1) {
        // 토너먼트 완료
        setChampion(newWinners[0]);
      } else {
        // 다음 라운드로
        setParticipants(newWinners);
        setWinners([]);
        setCurrentMatch(0);
        setCurrentRound(currentRound + 1);
        setCurrentPair({
          pokemon1: newWinners[0],
          pokemon2: newWinners[1]
        });
      }
    }
  };

  const restartTournament = () => {
    setCurrentRound(1);
    setCurrentMatch(0);
    setParticipants([]);
    setWinners([]);
    setCurrentPair(null);
    setChampion(null);
    initializeTournament();
  };

  if (loading) {
    return (
      <div className="modal-backdrop flex items-center justify-center p-4 z-50">
        <div className="modal-content p-8">
          <LoadingSpinner message="포켓몬 월드컵을 준비하고 있습니다..." />
        </div>
      </div>
    );
  }

  if (champion) {
    return (
      <div className="modal-backdrop flex items-center justify-center p-4 z-50">
        <div className="modal-content max-w-md w-full p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-yellow-600">🏆 우승!</h2>
          <div className="mb-6">
            <img
              src={champion.sprites.other['official-artwork']?.front_default || champion.sprites.front_default}
              alt={PokemonService.getKoreanName(champion)}
              className="w-48 h-48 object-contain mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold">
              {PokemonService.getKoreanName(champion)}
            </h3>
            <p className="text-muted mt-2">축하합니다! 당신이 선택한 최고의 포켓몬입니다!</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={restartTournament}
              className="btn-primary flex-1"
            >
              다시 시작
            </button>
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="modal-content max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">포켓몬 월드컵 🏆</h2>
            <p className="text-muted">더 좋아하는 포켓몬을 선택하세요!</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">{roundName}</h3>
          <p className="text-muted">
            {currentMatch + 1} / {Math.ceil(participants.length / 2)} 경기
          </p>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentMatch + 1) / Math.ceil(participants.length / 2)) * 100}%` 
              }}
            />
          </div>
        </div>

        {currentPair && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[currentPair.pokemon1, currentPair.pokemon2].map((pokemon, index) => (
              <div key={pokemon.id} className="text-center">
                <button
                  onClick={() => handlePokemonSelect(pokemon)}
                  className="w-full p-6 rounded-lg border-2 border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700"
                >
                  <img
                    src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                    alt={PokemonService.getKoreanName(pokemon)}
                    className="w-40 h-40 object-contain mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">
                    {PokemonService.getKoreanName(pokemon)}
                  </h3>
                  <div className="flex justify-center space-x-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                      >
                        {PokemonService.getTypeKoreanName(type.type.name)}
                      </span>
                    ))}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-muted">
            남은 참가자: {participants.length}명
          </p>
        </div>
      </div>
    </div>
  );
}
