import React from 'react';
import { Pokemon, PokemonSpecies } from '../types/pokemon';
import { PokemonService } from '../services/pokemonService';

interface PokemonDetailProps {
  pokemon: Pokemon;
  species?: PokemonSpecies | null;
  onClose: () => void;
}

export function PokemonDetail({ pokemon, species, onClose }: PokemonDetailProps) {
  const koreanName = species ? PokemonService.getKoreanName(species) : pokemon.name;
  const flavorText = species ? PokemonService.getKoreanFlavorText(species) : '';

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            #{PokemonService.formatPokemonId(pokemon.id)} {koreanName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이미지 섹션 */}
            <div className="text-center">
              <img
                src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-64 h-64 object-contain mx-auto mb-4"
              />
              <div className="flex justify-center space-x-4">
                <img
                  src={pokemon.sprites.front_default}
                  alt={`${pokemon.name} 기본`}
                  className="w-16 h-16 border border-gray-200 rounded"
                />
                {pokemon.sprites.front_shiny && (
                  <img
                    src={pokemon.sprites.front_shiny}
                    alt={`${pokemon.name} 색이 다른`}
                    className="w-16 h-16 border border-gray-200 rounded"
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
                    <span className="text-gray-600">타입:</span>
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
                    <span className="text-gray-600">키:</span>
                    <span>{(pokemon.height / 10).toFixed(1)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">몸무게:</span>
                    <span>{(pokemon.weight / 10).toFixed(1)}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">기초 경험치:</span>
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
                      <span className="text-gray-600">
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
                  <p className="text-gray-700 leading-relaxed">{flavorText}</p>
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
                    <span className="text-gray-600">
                      {PokemonService.getStatKoreanName(stat.stat.name)}
                    </span>
                    <span className="font-semibold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (stat.base_stat / 200) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              총 능력치: {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
