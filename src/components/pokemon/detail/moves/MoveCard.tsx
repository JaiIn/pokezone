import React, { useState, useEffect } from 'react';
import { Move } from '../../../../types';
import { PokemonService } from '../../../../services/pokemonService';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { MoveStatsDisplay } from './MoveStatsDisplay';
import { MoveWithMetadata } from '../../../../utils/movesUtils';

interface MoveCardProps {
  moveData: MoveWithMetadata;
  colorClass?: string;
  moveDetail?: Move;
  onLoadDetail: (moveName: string) => void;
}

export const MoveCard = React.memo(({ moveData, colorClass = 'green', moveDetail, onLoadDetail }: MoveCardProps) => {
  const { language } = useLanguage();
  const { move, level, method } = moveData;
  const [localizedName, setLocalizedName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoveName = async () => {
      try {
        // 먼저 기본 영어 이름으로 표시
        const fallbackName = PokemonService.formatSimpleMoveName(move.name);
        setLocalizedName(fallbackName);
        setLoading(false);

        // 만약 moveDetail이 있다면 그것을 사용
        if (moveDetail) {
          const formattedName = PokemonService.formatMoveName(moveDetail, language);
          setLocalizedName(formattedName);
        } else if (language !== 'en') {
          // 비동기로 정확한 번역 로드 (영어가 아니어만)
          try {
            const asyncName = await PokemonService.formatMoveNameAsync(move.name, language);
            if (asyncName !== fallbackName) {
              setLocalizedName(asyncName);
            }
          } catch (error) {
            console.warn(`Failed to load localized name for ${move.name}:`, error);
          }
        }
      } catch (error) {
        console.warn(`Failed to load move name for ${move.name}:`, error);
        setLocalizedName(PokemonService.formatSimpleMoveName(move.name));
        setLoading(false);
      }
    };

    loadMoveName();
  }, [move.name, language, moveDetail]);

  const getLabelContent = () => {
    if (level !== undefined) {
      return `🌳 Level ${level}`;
    }
    if (method) {
      return `✨ ${PokemonService.formatLearnMethodName(method)}`;
    }
    return '🔧 TM';
  };

  return (
    <div
      className={`group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 border border-transparent hover:border-${colorClass}-300 dark:hover:border-${colorClass}-500`}
      onClick={() => onLoadDetail(move.name)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-1 bg-${colorClass}-100 dark:bg-${colorClass}-900 text-${colorClass}-800 dark:text-${colorClass}-200 text-xs font-medium rounded-full`}>
          {getLabelContent()}
        </span>
        {moveDetail && (
          <span
            className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetail.type.name)}`}
          >
            {PokemonService.formatTypeName(moveDetail.type.name, language)}
          </span>
        )}
      </div>
      <div className={`font-medium text-gray-900 dark:text-slate-100 group-hover:text-${colorClass}-600 dark:group-hover:text-${colorClass}-400`}>
        {loading ? (
          <span className="animate-pulse bg-gray-200 dark:bg-slate-600 rounded px-2 py-1">
            Loading...
          </span>
        ) : (
          localizedName
        )}
      </div>
      {moveDetail && <MoveStatsDisplay move={moveDetail} />}
    </div>
  );
});

MoveCard.displayName = 'MoveCard';
