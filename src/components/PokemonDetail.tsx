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
      return <div className="text-center text-muted">진화 정보를 로드할 수 없습니다.</div>;
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

      // 레벨 조건
      if (detail.min_level) {
        conditions.push(`레벨 ${detail.min_level}`);
      }

      // 진화석 조건
      if (detail.item) {
        const itemName = detail.item.name;
        const stoneNames: { [key: string]: string } = {
          'fire-stone': '불꽃의돌',
          'water-stone': '물의돌',
          'thunder-stone': '번개의돌',
          'leaf-stone': '잎의돌',
          'moon-stone': '달의돌',
          'sun-stone': '태양의돌',
          'shiny-stone': '빛의돌',
          'dusk-stone': '어둠의돌',
          'dawn-stone': '각성의돌',
          'ice-stone': '얼음의돌'
        };
        conditions.push(stoneNames[itemName] || itemName);
      }

      // 시간 조건
      if (detail.time_of_day) {
        const timeNames: { [key: string]: string } = {
          'day': '낮',
          'night': '밤'
        };
        conditions.push(timeNames[detail.time_of_day] || detail.time_of_day);
      }

      // 친밀도 조건
      if (detail.min_happiness) {
        conditions.push(`친밀도 ${detail.min_happiness}`);
      }

      // 교환 조건
      if (detail.trigger?.name === 'trade') {
        conditions.push('교환');
        if (detail.held_item) {
          conditions.push(`(${detail.held_item.name} 소지)`);
        }
      }

      // 위치 조건
      if (detail.location) {
        conditions.push(`특정 장소`);
      }

      // 특수 조건들
      if (detail.known_move) {
        conditions.push(`${detail.known_move.name} 습득`);
      }

      if (detail.party_species) {
        conditions.push('파티에 특정 포켓몬');
      }

      return conditions.length > 0 ? conditions.join(' + ') : '특수조건';
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

        // 진화 조건 추가 (첫 번째 단계가 아닌 경우만)
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

        // 다음 진화 단계 처리
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
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">진화 계보</h3>
        </div>
        
        {evolutionStages.map((stage, stageIndex) => (
          <div key={stageIndex}>
            {/* 진화 조건 표시 (첫 번째 단계가 아닌 경우) */}
            {stageIndex > 0 && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold mb-2">
                  ↓
                </div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {stage.length > 0 && stage[0].minLevel && `레벨 ${stage[0].minLevel}`}
                  {stage.length > 0 && stage[0].item && (
                    <div className="mt-1">
                      {getEvolutionCondition([{
                        min_level: stage[0].minLevel,
                        item: { name: stage[0].item },
                        trigger: { name: stage[0].trigger },
                        time_of_day: stage[0].timeOfDay,
                        location: stage[0].location ? { name: stage[0].location } : null,
                        min_happiness: stage[0].friendship ? 220 : null
                      }])}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 진화 단계 표시 */}
            <div className="text-center mb-3">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-300">
                {stageIndex === 0 ? '기본형' : stageIndex === 1 ? '1차 진화' : '2차 진화'}
              </h4>
            </div>

            {/* 포켓몬 카드들 */}
            <div className="flex flex-wrap justify-center gap-4">
              {stage.map((pokemon, index) => (
                <div
                  key={`${pokemon.name}-${index}`}
                  className="bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ minWidth: '150px' }}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                        alt={pokemon.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                        #{pokemon.id.padStart(3, '0')}
                      </div>
                      <div className="font-medium capitalize text-gray-900 dark:text-slate-100">
                        {pokemon.name}
                      </div>
                      {/* 한국어 이름 표시 (있는 경우) */}
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        {PokemonService.getKoreanName({ id: parseInt(pokemon.id), name: pokemon.name } as any)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 진화 체인이 1단계뿐인 경우 메시지 */}
        {evolutionStages.length === 1 && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <span className="text-gray-600 dark:text-slate-400">이 포켓몬은 진화하지 않습니다</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 기술 목록 렌더링
  const renderMoves = () => {
    if (!fullDetail?.moves) {
      return <div className="text-center text-muted">기술 정보를 로드할 수 없습니다.</div>;
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

    return (
      <div className="space-y-6">
        {/* 레벨업 기술 */}
        <div>
          <h4 className="text-lg font-semibold mb-3">레벨업으로 배우는 기술</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {levelUpMoves.map(({ move, level }) => (
              <div
                key={move.name}
                className="flex items-center justify-between p-2 border border-muted rounded hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => loadMoveDetail(move.name)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-12 text-center">
                    Lv.{level}
                  </span>
                  <span className="capitalize">{move.name}</span>
                  {moveDetails[move.name] && (
                    <span
                      className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetails[move.name].type.name)}`}
                    >
                      {PokemonService.getTypeKoreanName(moveDetails[move.name].type.name)}
                    </span>
                  )}
                </div>
                {moveDetails[move.name] && (
                  <div className="text-sm text-muted">
                    {moveDetails[move.name].power 
                      ? `위력: ${moveDetails[move.name].power}` 
                      : PokemonService.getDamageClassKoreanName(moveDetails[move.name].damage_class.name)
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 기술머신 기술 */}
        {machineMoves.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-3">기술머신으로 배우는 기술</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {machineMoves.map(({ move }) => (
                <div
                  key={move.name}
                  className="flex items-center justify-between p-2 border border-muted rounded hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                  onClick={() => loadMoveDetail(move.name)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-12 text-center">TM</span>
                    <span className="capitalize">{move.name}</span>
                    {moveDetails[move.name] && (
                      <span
                        className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetails[move.name].type.name)}`}
                      >
                        {PokemonService.getTypeKoreanName(moveDetails[move.name].type.name)}
                      </span>
                    )}
                  </div>
                  {moveDetails[move.name] && (
                    <div className="text-sm text-muted">
                      {moveDetails[move.name].power 
                        ? `위력: ${moveDetails[move.name].power}` 
                        : PokemonService.getDamageClassKoreanName(moveDetails[move.name].damage_class.name)
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
