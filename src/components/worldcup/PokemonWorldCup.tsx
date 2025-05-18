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

interface TournamentSize {
  value: number;
  label: string;
  emoji: string;
}

const TOURNAMENT_SIZES: TournamentSize[] = [
  { value: 16, label: '16강', emoji: '🥉' },
  { value: 32, label: '32강', emoji: '🥈' },
  { value: 64, label: '64강', emoji: '🥇' },
  { value: 128, label: '128강', emoji: '👑' },
  { value: 256, label: '256강', emoji: '🏆' }
];

export function PokemonWorldCup({ onClose }: PokemonWorldCupProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [participants, setParticipants] = useState<Pokemon[]>([]);
  const [winners, setWinners] = useState<Pokemon[]>([]);
  const [currentPair, setCurrentPair] = useState<MatchPair | null>(null);
  const [loading, setLoading] = useState(false);
  const [champion, setChampion] = useState<Pokemon | null>(null);
  const [roundName, setRoundName] = useState('');

  useEffect(() => {
    if (selectedSize && participants.length > 0) {
      updateRoundName();
    }
  }, [currentRound, participants, selectedSize]);

  const initializeTournament = async (size: number) => {
    setLoading(true);
    try {
      // 선택된 크기만큼 랜덤 포켓몬 선택 (1~1025 사이에서)
      const pokemonIds = [];
      const usedIds = new Set();
      
      while (pokemonIds.length < size) {
        const id = Math.floor(Math.random() * 1025) + 1;
        if (!usedIds.has(id)) {
          pokemonIds.push(id);
          usedIds.add(id);
        }
      }

      // 포켓몬 데이터를 배치로 로드 (성능 최적화)
      const pokemonPromises = pokemonIds.map(id => PokemonService.getPokemon(id));
      const pokemonList = await Promise.all(pokemonPromises);
      
      setParticipants(pokemonList);
      setSelectedSize(size);
      setCurrentRound(1);
      setCurrentMatch(0);
      setWinners([]);
      setChampion(null);
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
    if (remaining === 256) setRoundName('256강');
    else if (remaining === 128) setRoundName('128강');
    else if (remaining === 64) setRoundName('64강');
    else if (remaining === 32) setRoundName('32강');
    else if (remaining === 16) setRoundName('16강');
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

  const resetTournament = () => {
    setSelectedSize(null);
    setCurrentRound(1);
    setCurrentMatch(0);
    setParticipants([]);
    setWinners([]);
    setCurrentPair(null);
    setChampion(null);
  };

  const getRemainingMatches = () => {
    return Math.ceil(participants.length / 2) - currentMatch - 1;
  };

  const getTotalRounds = (size: number) => {
    return Math.log2(size);
  };

  const getProgressPercentage = () => {
    if (!selectedSize) return 0;
    const totalMatches = selectedSize - 1; // 전체 경기 수
    const completedMatches = (selectedSize - participants.length) + currentMatch;
    return (completedMatches / totalMatches) * 100;
  };

  // 토너먼트 크기 선택 화면
  if (!selectedSize) {
    return (
      <div className="modal-backdrop flex items-center justify-center p-4 z-50">
        <div className="modal-content max-w-2xl w-full p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">포켓몬 월드컵 🏆</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg text-muted">
              토너먼트 규모를 선택하세요
            </p>
            <p className="text-sm text-muted mt-2">
              더 큰 토너먼트일수록 더 많은 포켓몬과 더 오래 즐길 수 있습니다!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOURNAMENT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => initializeTournament(size.value)}
                disabled={loading}
                className="p-6 rounded-lg border-2 border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-4xl mb-3">{size.emoji}</div>
                <div className="text-xl font-bold mb-2">{size.label}</div>
                <div className="text-sm text-muted">
                  {size.value}마리 참가
                </div>
                <div className="text-xs text-muted mt-1">
                  총 {size.value - 1}경기
                </div>
              </button>
            ))}
          </div>

          {loading && (
            <div className="mt-8">
              <LoadingSpinner message="포켓몬들을 모집하고 있습니다..." />
            </div>
          )}
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
            <p className="text-muted mt-2">
              {selectedSize}강 토너먼트 우승자입니다! 🎉
            </p>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-sm text-muted">
                총 {selectedSize - 1}경기를 거쳐 우승
              </div>
              <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                {TOURNAMENT_SIZES.find(t => t.value === selectedSize)?.emoji} 
                {TOURNAMENT_SIZES.find(t => t.value === selectedSize)?.label} 챔피언
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={resetTournament}
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
          <div className="flex items-center space-x-4">
            <button
              onClick={resetTournament}
              className="btn-secondary text-sm"
            >
              토너먼트 변경
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 토너먼트 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-sm text-muted">현재 라운드</div>
            <div className="text-xl font-bold">{roundName}</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-sm text-muted">현재 경기</div>
            <div className="text-xl font-bold">
              {currentMatch + 1} / {Math.ceil(participants.length / 2)}
            </div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-sm text-muted">남은 참가자</div>
            <div className="text-xl font-bold">{participants.length}명</div>
          </div>
        </div>

        {/* 전체 진행도 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">전체 진행도</span>
            <span className="text-sm text-muted">
              {getProgressPercentage().toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-1">
            남은 경기: {selectedSize - 1 - (selectedSize - participants.length) - currentMatch}경기
          </div>
        </div>

        {/* 현재 라운드 진행도 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{roundName} 진행도</span>
            <span className="text-sm text-muted">
              {Math.round(((currentMatch + 1) / Math.ceil(participants.length / 2)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
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
                  <div className="mt-3 text-sm text-muted">
                    #{PokemonService.formatPokemonId(pokemon.id)}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
