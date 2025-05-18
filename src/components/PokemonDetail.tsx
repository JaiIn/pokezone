import React, { useState, useEffect } from 'react';
import { Pokemon, PokemonSpecies, PokemonDetail as PokemonDetailType, Move } from '../types/pokemon';
import { PokemonService } from '../services/pokemonService';

interface PokemonDetailProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
  onClose: () => void;
}

export function PokemonDetail({ pokemon, species, onClose }: PokemonDetailProps) {
  const [fullDetail, setFullDetail] = useState<PokemonDetailType | null>(null);
  const [selectedTab, setSelectedTab] = useState<'info' | 'evolution' | 'moves'>('info');
  const [moveDetails, setMoveDetails] = useState<{ [key: string]: Move }>({});
  const [loading, setLoading] = useState(false);

  const koreanName = PokemonService.getKoreanName(pokemon, species);
  const flavorText = species ? PokemonService.getKoreanFlavorText(species) : '';

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

  // 진화 체인 렌더링
  const renderEvolutionChain = () => {
    if (!fullDetail?.evolutionChain) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">🔄</div>
          <p className="text-muted text-lg">진화 정보를 로드할 수 없습니다</p>
        </div>
      );
    }

    // 포켓몬 진화 정보 타입 정의
    interface EvolutionPokemon {
      name: string;
      id: string;
      minLevel?: number;
      trigger?: string;
      item?: string;
      timeOfDay?: string;
      location?: string;
      friendship?: boolean;
      trade?: boolean;
      stone?: string;
    }

    // 포켓몬 이름에서 ID 추출하는 헬퍼 함수
    const getPokemonIdFromUrl = (url: string): string => {
      const match = url.match(/\/pokemon-species\/(\d+)\//); 
      return match ? match[1] : '1';
    };

    // 진화 조건 문자열 생성
    const getEvolutionCondition = (evolutionDetails: any[]): string => {
      if (!evolutionDetails || evolutionDetails.length === 0) {
        return '';
      }

      const detail = evolutionDetails[0];
      const conditions: string[] = [];

      if (detail.min_level) {
        conditions.push(`레벨 ${detail.min_level}`);
      }

      if (detail.item) {
        const itemName = detail.item.name;
        const stoneNames: { [key: string]: string } = {
          'fire-stone': '🔥 불꽃의돌',
          'water-stone': '💧 물의돌',
          'thunder-stone': '⚡ 번개의돌',
          'leaf-stone': '🍃 잎의돌',
          'moon-stone': '🌙 달의돌',
          'sun-stone': '☀️ 태양의돌',
          'shiny-stone': '✨ 빛의돌',
          'dusk-stone': '🌒 어둠의돌',
          'dawn-stone': '🌅 각성의돌',
          'ice-stone': '❄️ 얼음의돌'
        };
        conditions.push(stoneNames[itemName] || `🔸 ${itemName}`);
      }

      if (detail.time_of_day) {
        const timeNames: { [key: string]: string } = {
          'day': '☀️ 낮 시간',
          'night': '🌙 밤 시간'
        };
        conditions.push(timeNames[detail.time_of_day] || detail.time_of_day);
      }

      if (detail.min_happiness) {
        conditions.push(`💕 친밀도 ${detail.min_happiness}+`);
      }

      if (detail.trigger?.name === 'trade') {
        conditions.push('🔄 교환 진화');
        if (detail.held_item) {
          conditions.push(`📦 ${detail.held_item.name} 소지`);
        }
      }

      if (detail.location) {
        conditions.push(`📍 특정 장소`);
      }

      if (detail.known_move) {
        conditions.push(`🎯 ${detail.known_move.name} 습득`);
      }

      if (detail.party_species) {
        conditions.push('👥 파티에 특정 포켓몬');
      }

      return conditions.length > 0 ? conditions.join(' • ') : '🌟 특수조건';
    };

    // 진화 체인을 단계별로 처리
    const processEvolutionChain = (chain: any): EvolutionPokemon[][] => {
      const stages: EvolutionPokemon[][] = [];
      
      const traverse = (node: any, stageIndex: number) => {
        if (!stages[stageIndex]) {
          stages[stageIndex] = [];
        }

        const pokemon: EvolutionPokemon = {
          name: node.species.name,
          id: getPokemonIdFromUrl(node.species.url)
        };

        if (stageIndex > 0 && node.evolution_details && node.evolution_details.length > 0) {
          const detail = node.evolution_details[0];
          pokemon.minLevel = detail.min_level;
          pokemon.trigger = detail.trigger?.name;
          pokemon.item = detail.item?.name;
          pokemon.timeOfDay = detail.time_of_day;
          pokemon.location = detail.location?.name;
          pokemon.friendship = detail.min_happiness > 0;
          pokemon.trade = detail.trigger?.name === 'trade';
        }

        stages[stageIndex].push(pokemon);

        if (node.evolves_to && node.evolves_to.length > 0) {
          node.evolves_to.forEach((evolution: any) => {
            traverse(evolution, stageIndex + 1);
          });
        }
      };

      traverse(chain, 0);
      return stages;
    };

    const evolutionStages = processEvolutionChain(fullDetail.evolutionChain.chain);

    return (
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🧬</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">진화 계보</h3>
          <p className="text-muted mt-2">포켓몬의 진화 단계와 조건을 확인하세요</p>
        </div>
        
        {/* 진화 체인 */}
        <div className="space-y-8">
          {evolutionStages.map((stage, stageIndex) => (
            <div key={stageIndex} className="relative">
              {/* 진화 조건 (첫 번째 단계가 아닌 경우) */}
              {stageIndex > 0 && (
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">⬇️</span>
                      <span className="font-medium">
                        {stage.length > 0 && stage[0].minLevel && `레벨 ${stage[0].minLevel}`}
                        {stage.length > 0 && stage[0].item && (
                          getEvolutionCondition([{
                            min_level: stage[0].minLevel,
                            item: { name: stage[0].item },
                            trigger: { name: stage[0].trigger },
                            time_of_day: stage[0].timeOfDay,
                            location: stage[0].location ? { name: stage[0].location } : null,
                            min_happiness: stage[0].friendship ? 220 : null
                          }])
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 단계 레이블 */}
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-full text-sm font-semibold text-gray-700 dark:text-slate-300">
                  {stageIndex === 0 ? '🥚 기본형' : stageIndex === 1 ? '🌱 1차 진화' : '🌺 최종 진화'}
                </span>
              </div>

              {/* 포켓몬 카드들 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {stage.map((pokemon, index) => (
                  <div
                    key={`${pokemon.name}-${index}`}
                    className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-600 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                    style={{ minWidth: '200px', maxWidth: '220px' }}
                  >
                    <div className="text-center">
                      {/* 포켓몬 이미지 */}
                      <div className="relative w-28 h-28 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 rounded-full group-hover:animate-pulse"></div>
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                          alt={pokemon.name}
                          className="relative z-10 w-full h-full object-contain p-2"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                          }}
                        />
                      </div>
                      
                      {/* 포켓몬 정보 */}
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          #{pokemon.id.padStart(3, '0')}
                        </div>
                        <div className="font-bold text-lg capitalize text-gray-900 dark:text-slate-100">
                          {pokemon.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-slate-400">
                          {PokemonService.getKoreanName({ id: parseInt(pokemon.id), name: pokemon.name } as any)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 진화하지 않는 포켓몬 메시지 */}
        {evolutionStages.length === 1 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <span className="text-2xl mr-2">💎</span>
              <span className="text-amber-800 dark:text-amber-200 font-medium">이 포켓몬은 진화하지 않는 완성형입니다</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 기술 목록 렌더링
  const renderMoves = () => {
    if (!fullDetail?.moves) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">⚔️</div>
          <p className="text-muted text-lg">기술 정보를 로드할 수 없습니다</p>
        </div>
      );
    }

    // 레벨업으로 배우는 기술만 필터링하고 레벨별로 정렬
    const levelUpMoves = fullDetail.moves
      .filter(pokemonMove => 
        pokemonMove.version_group_details.some(
          detail => detail.move_learn_method.name === 'level-up'
        )
      )
      .map(pokemonMove => {
        const levelUpDetail = pokemonMove.version_group_details.find(
          detail => detail.move_learn_method.name === 'level-up'
        );
        return {
          move: pokemonMove.move,
          level: levelUpDetail?.level_learned_at || 0
        };
      })
      .sort((a, b) => a.level - b.level);

    // 기술머신으로 배우는 기술
    const machineMoves = fullDetail.moves
      .filter(pokemonMove => 
        pokemonMove.version_group_details.some(
          detail => detail.move_learn_method.name === 'machine'
        )
      )
      .map(pokemonMove => ({
        move: pokemonMove.move,
        level: null
      }));

    // 기타 방법으로 배우는 기술
    const otherMoves = fullDetail.moves
      .filter(pokemonMove => 
        pokemonMove.version_group_details.some(
          detail => detail.move_learn_method.name !== 'level-up' && detail.move_learn_method.name !== 'machine'
        )
      )
      .map(pokemonMove => {
        const otherDetail = pokemonMove.version_group_details.find(
          detail => detail.move_learn_method.name !== 'level-up' && detail.move_learn_method.name !== 'machine'
        );
        return {
          move: pokemonMove.move,
          method: otherDetail?.move_learn_method.name || 'unknown'
        };
      });

    return (
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎨</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">배울 수 있는 기술</h3>
          <p className="text-muted mt-2">포켓몬이 습득할 수 있는 모든 기술들을 확인하세요</p>
        </div>

        <div className="space-y-8">
          {/* 레벨업 기술 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🌆</span>
                <h4 className="text-lg font-bold">레벨업 기술 ({levelUpMoves.length}개)</h4>
              </div>
              <p className="text-green-100 text-sm mt-1">레벨업으로 자연스럽게 배우는 기술들</p>
            </div>
            <div className="p-4">
              {levelUpMoves.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {levelUpMoves.map(({ move, level }) => (
                    <div
                      key={move.name}
                      className="group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 border border-transparent hover:border-green-300 dark:hover:border-green-500"
                      onClick={() => loadMoveDetail(move.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                          🌳 레벨 {level}
                        </span>
                        {moveDetails[move.name] && (
                          <span
                            className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetails[move.name].type.name)}`}
                          >
                            {PokemonService.getTypeKoreanName(moveDetails[move.name].type.name)}
                          </span>
                        )}
                      </div>
                      <div className="font-medium capitalize text-gray-900 dark:text-slate-100 group-hover:text-green-600 dark:group-hover:text-green-400">
                        {move.name.replace(/-/g, ' ')}
                      </div>
                      {moveDetails[move.name] && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
                            <span className="flex items-center">
                              {moveDetails[move.name].power ? (
                                <><span className="text-red-500">💥</span> 위력: {moveDetails[move.name].power}</>
                              ) : (
                                <><span className="text-blue-500">🔘</span> {PokemonService.getDamageClassKoreanName(moveDetails[move.name].damage_class.name)}</>
                              )}
                            </span>
                            <span className="flex items-center">
                              <span className="text-purple-500">⚡</span> PP: {moveDetails[move.name].pp}
                            </span>
                          </div>
                          {moveDetails[move.name].accuracy && (
                            <div className="text-xs text-gray-600 dark:text-slate-400">
                              <span className="text-orange-500">🎯</span> 명중률: {moveDetails[move.name].accuracy}%
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                  <div className="text-4xl mb-2">🤷‍♂️</div>
                  <p>레벨업으로 배우는 기술이 없습니다</p>
                </div>
              )}
            </div>
          </div>

          {/* 기술머신 기술 */}
          {machineMoves.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🔧</span>
                  <h4 className="text-lg font-bold">기술머신 기술 ({machineMoves.length}개)</h4>
                </div>
                <p className="text-blue-100 text-sm mt-1">TM을 사용해서 배울 수 있는 기술들</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {machineMoves.map(({ move }) => (
                    <div
                      key={move.name}
                      className="group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-300 dark:hover:border-blue-500"
                      onClick={() => loadMoveDetail(move.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                          🔧 TM
                        </span>
                        {moveDetails[move.name] && (
                          <span
                            className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetails[move.name].type.name)}`}
                          >
                            {PokemonService.getTypeKoreanName(moveDetails[move.name].type.name)}
                          </span>
                        )}
                      </div>
                      <div className="font-medium capitalize text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {move.name.replace(/-/g, ' ')}
                      </div>
                      {moveDetails[move.name] && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
                            <span className="flex items-center">
                              {moveDetails[move.name].power ? (
                                <><span className="text-red-500">💥</span> 위력: {moveDetails[move.name].power}</>
                              ) : (
                                <><span className="text-blue-500">🔘</span> {PokemonService.getDamageClassKoreanName(moveDetails[move.name].damage_class.name)}</>
                              )}
                            </span>
                            <span className="flex items-center">
                              <span className="text-purple-500">⚡</span> PP: {moveDetails[move.name].pp}
                            </span>
                          </div>
                          {moveDetails[move.name].accuracy && (
                            <div className="text-xs text-gray-600 dark:text-slate-400">
                              <span className="text-orange-500">🎯</span> 명중률: {moveDetails[move.name].accuracy}%
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 기타 방법으로 배우는 기술 */}
          {otherMoves.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">✨</span>
                  <h4 className="text-lg font-bold">기타 기술 ({otherMoves.length}개)</h4>
                </div>
                <p className="text-purple-100 text-sm mt-1">특별한 방법으로 배우는 기술들</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {otherMoves.map(({ move, method }) => (
                    <div
                      key={move.name}
                      className="group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 border border-transparent hover:border-purple-300 dark:hover:border-purple-500"
                      onClick={() => loadMoveDetail(move.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full">
                          ✨ {PokemonService.getLearnMethodKoreanName(method)}
                        </span>
                        {moveDetails[move.name] && (
                          <span
                            className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetails[move.name].type.name)}`}
                          >
                            {PokemonService.getTypeKoreanName(moveDetails[move.name].type.name)}
                          </span>
                        )}
                      </div>
                      <div className="font-medium capitalize text-gray-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {move.name.replace(/-/g, ' ')}
                      </div>
                      {moveDetails[move.name] && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
                            <span className="flex items-center">
                              {moveDetails[move.name].power ? (
                                <><span className="text-red-500">💥</span> 위력: {moveDetails[move.name].power}</>
                              ) : (
                                <><span className="text-blue-500">🔘</span> {PokemonService.getDamageClassKoreanName(moveDetails[move.name].damage_class.name)}</>
                              )}
                            </span>
                            <span className="flex items-center">
                              <span className="text-purple-500">⚡</span> PP: {moveDetails[move.name].pp}
                            </span>
                          </div>
                          {moveDetails[move.name].accuracy && (
                            <div className="text-xs text-gray-600 dark:text-slate-400">
                              <span className="text-orange-500">🎯</span> 명중률: {moveDetails[move.name].accuracy}%
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 통계 요약 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">기술 학습 통계</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{levelUpMoves.length}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">레벨업 기술</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{machineMoves.length}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">기술머신 기술</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{levelUpMoves.length + machineMoves.length + otherMoves.length}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400">총 기술 수</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="modal-backdrop flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="modal-content max-w-4xl w-full max-h-screen overflow-y-auto">
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
        <div className="border-b border-muted">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('info')}
              className={`px-4 py-2 font-medium ${selectedTab === 'info' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-muted hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              기본 정보
            </button>
            <button
              onClick={() => setSelectedTab('evolution')}
              className={`px-4 py-2 font-medium ${selectedTab === 'evolution' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-muted hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              진화
            </button>
            <button
              onClick={() => setSelectedTab('moves')}
              className={`px-4 py-2 font-medium ${selectedTab === 'moves' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-muted hover:text-gray-700 dark:hover:text-slate-300'
              }`}
            >
              기술
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-muted">상세 정보를 로드하는 중...</p>
            </div>
          )}

          {!loading && selectedTab === 'info' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 이미지 섹션 */}
                <div className="text-center">
                  <img
                    src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                    alt={koreanName}
                    className="w-64 h-64 object-contain mx-auto mb-4"
                  />
                  <div className="flex justify-center space-x-4">
                    <img
                      src={pokemon.sprites.front_default}
                      alt={`${koreanName} 기본`}
                      className="w-16 h-16 border border-muted rounded"
                    />
                    {pokemon.sprites.front_shiny && (
                      <img
                        src={pokemon.sprites.front_shiny}
                        alt={`${koreanName} 색이 다른`}
                        className="w-16 h-16 border border-muted rounded"
                      />
                    )}
                  </div>
                </div>

                {/* 기본 정보 섹션 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">기본 정보</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">영문명:</span>
                        <span className="capitalize">{pokemon.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">타입:</span>
                        <div className="flex space-x-1">
                          {pokemon.types.map((type) => (
                            <span
                              key={type.type.name}
                              className={`pokemon-type text-xs ${PokemonService.getTypeColor(type.type.name)}`}
                            >
                              {PokemonService.getTypeKoreanName(type.type.name)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">키:</span>
                        <span>{(pokemon.height / 10).toFixed(1)}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">몸무게:</span>
                        <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">기초 경험치:</span>
                        <span>{pokemon.base_experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* 특성 */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">특성</h3>
                    <div className="space-y-1">
                      {pokemon.abilities.map((ability, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-muted">
                            {ability.is_hidden ? '숨겨진 특성:' : '특성:'}
                          </span>
                          <span className="capitalize">{ability.ability.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 설명 */}
                  {flavorText && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">설명</h3>
                      <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{flavorText}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 능력치 섹션 */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">기본 능력치</h3>
                <div className="space-y-4">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-muted">
                          {PokemonService.getStatKoreanName(stat.stat.name)}
                        </span>
                        <span className="font-semibold">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (stat.base_stat / 200) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-muted">
                  총 능력치: {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                </div>
              </div>
            </>
          )}

          {!loading && selectedTab === 'evolution' && renderEvolutionChain()}

          {!loading && selectedTab === 'moves' && renderMoves()}
        </div>
      </div>
    </div>
  );
}
