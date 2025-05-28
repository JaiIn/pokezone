import React from 'react';
import { PokemonDetail } from '../../../types';
import { useMoveDetails } from '../../../hooks/useMoveDetails';
import { categorizeMoves, calculateMoveStats } from '../../../utils/movesUtils';
import { MovesHeader } from './moves/MovesHeader';
import { MovesSection } from './moves/MovesSection';
import { MovesStatistics } from './moves/MovesStatistics';
import { EmptyMovesState } from './moves/EmptyMovesState';

interface MovesListProps {
  fullDetail: PokemonDetail | null;
}

export function MovesList({ fullDetail }: MovesListProps) {
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
          title="Level-up Moves"
          icon="🌆"
          description="Moves learned naturally through leveling up"
          moves={categorizedMoves.levelUpMoves}
          colorClass="green"
          moveDetails={moveDetails}
          onLoadMoveDetail={loadMoveDetail}
        />

        {/* TM/TR Moves */}
        {categorizedMoves.machineMoves.length > 0 && (
          <MovesSection
            title="TM/TR Moves"
            icon="🔧"
            description="Moves that can be learned using Technical Machines"
            moves={categorizedMoves.machineMoves}
            colorClass="blue"
            moveDetails={moveDetails}
            onLoadMoveDetail={loadMoveDetail}
          />
        )}

        {/* Other Methods */}
        {categorizedMoves.otherMoves.length > 0 && (
          <MovesSection
            title="Special Moves"
            icon="✨"
            description="Moves learned through special methods"
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
