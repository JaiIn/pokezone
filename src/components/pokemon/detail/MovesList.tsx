import React from 'react';
import { PokemonDetail } from '../../../types';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { categorizeMoves, calculateMoveStats } from '../../../utils/movesUtils';
import { MovesHeader } from './moves/MovesHeader';
import { MovesSection } from './moves/MovesSection';
import { MovesStatistics } from './moves/MovesStatistics';
import { EmptyMovesState } from './moves/EmptyMovesState';
import { useLanguage } from '../../../contexts/LanguageContext';
import { t } from '../../../utils/translations';

interface MovesListProps {
  fullDetail: PokemonDetail | null;
}

export function MovesList({ fullDetail }: MovesListProps) {
  const { language } = useLanguage();
  const { moveDetails, loadMoveDetail } = useMoveDetails();

  if (!fullDetail?.moves) {
    return <EmptyMovesState />;
  }

  const categorizedMoves = categorizeMoves(fullDetail.moves);
  const stats = calculateMoveStats(categorizedMoves);

  return (
    <div className="max-w-6xl mx-auto">
      <MovesHeader />
      
      <div className="space-y-8">
        {/* Level-up Moves */}
        <MovesSection
          title={t('level_up_moves', language)}
          icon="🌆"
          description={t('moves_learned_naturally', language)}
          moves={categorizedMoves.levelUpMoves}
          colorClass="green"
          moveDetails={moveDetails}
          onLoadMoveDetail={loadMoveDetail}
        />

        {/* TM/TR Moves */}
        {categorizedMoves.machineMoves.length > 0 && (
          <MovesSection
            title={t('tm_tr_moves', language)}
            icon="🔧"
            description={t('moves_learned_tm', language)}
            moves={categorizedMoves.machineMoves}
            colorClass="blue"
            moveDetails={moveDetails}
            onLoadMoveDetail={loadMoveDetail}
          />
        )}

        {/* Other Methods */}
        {categorizedMoves.otherMoves.length > 0 && (
          <MovesSection
            title={t('special_moves', language)}
            icon="✨"
            description={t('moves_learned_special', language)}
            moves={categorizedMoves.otherMoves}
            colorClass="purple"
            moveDetails={moveDetails}
            onLoadMoveDetail={loadMoveDetail}
          />
        )}
      </div>

      <MovesStatistics {...stats} />
    </div>
  );
}
