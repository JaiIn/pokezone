import React from 'react';
import { PokemonDetail } from '../../../types/pokemon';
import { PokemonService } from '../../../services/pokemonService';

interface EvolutionChainProps {
  fullDetail: PokemonDetail | null;
  onPokemonSelect?: (pokemonName: string, pokemonId: string) => void;
}

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

export function EvolutionChain({ fullDetail, onPokemonSelect }: EvolutionChainProps) {
  if (!fullDetail?.evolutionChain) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🔄</div>
        <p className="text-muted text-lg">진화 정보를 로드할 수 없습니다</p>
      </div>
    );
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

  const handlePokemonClick = (pokemonName: string, pokemonId: string) => {
    if (onPokemonSelect) {
      onPokemonSelect(pokemonName, pokemonId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🧬</div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">진화 계보</h3>
        <p className="text-muted mt-2">포켓몬의 진화 단계와 조건을 확인하세요</p>
      </div>

      {/* 가로 진화 체인 */}
      <div className="flex items-center justify-center overflow-x-auto pb-4">
        <div className="flex items-center space-x-8 min-w-max">
          {evolutionStages.map((stage, stageIndex) => (
            <div key={stageIndex} className="flex items-center">
              {/* 포켓몬 카드 */}
              <div className="flex flex-col items-center">
                {/* 단계 레이블 */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-semibold text-gray-700 dark:text-slate-300">
                    {stageIndex === 0 ? '🥚 기본형' : stageIndex === 1 ? '🌱 1차 진화' : '🌺 최종 진화'}
                  </span>
                </div>

                {/* 포켓몬 들 */}
                <div className="space-y-4">
                  {stage.map((pokemon, index) => (
                    <div
                      key={`${pokemon.name}-${index}`}
                      className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-600 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                      style={{ width: '180px' }}
                      onClick={() => handlePokemonClick(pokemon.name, pokemon.id)}
                    >
                      <div className="text-center">
                        {/* 포켓몬 이미지 */}
                        <div className="relative w-24 h-24 mx-auto mb-3">
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
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            #{pokemon.id.padStart(3, '0')}
                          </div>
                          <div className="font-bold text-sm capitalize text-gray-900 dark:text-slate-100">
                            {PokemonService.getKoreanName({ id: parseInt(pokemon.id), name: pokemon.name } as any)}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">
                            {pokemon.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 진화 화살표 (마지막 단계가 아닌 경우) */}
              {stageIndex < evolutionStages.length - 1 && (
                <div className="flex flex-col items-center mx-8">
                  {/* 진화 조건 */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {evolutionStages[stageIndex + 1].length > 0 && evolutionStages[stageIndex + 1][0].minLevel && (
                            `레벨 ${evolutionStages[stageIndex + 1][0].minLevel}`
                          )}
                          {evolutionStages[stageIndex + 1].length > 0 && evolutionStages[stageIndex + 1][0].item && (
                            getEvolutionCondition([{
                              min_level: evolutionStages[stageIndex + 1][0].minLevel,
                              item: { name: evolutionStages[stageIndex + 1][0].item },
                              trigger: { name: evolutionStages[stageIndex + 1][0].trigger },
                              time_of_day: evolutionStages[stageIndex + 1][0].timeOfDay,
                              location: evolutionStages[stageIndex + 1][0].location ? { name: evolutionStages[stageIndex + 1][0].location } : null,
                              min_happiness: evolutionStages[stageIndex + 1][0].friendship ? 220 : null
                            }])
                          )}
                          {!evolutionStages[stageIndex + 1][0].minLevel && !evolutionStages[stageIndex + 1][0].item && '진화'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 화살표 */}
                  <div className="text-4xl text-blue-500 dark:text-blue-400">
                    ➡️
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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
}
