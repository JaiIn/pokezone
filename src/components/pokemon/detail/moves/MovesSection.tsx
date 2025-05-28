import React from 'react';
import { Move } from '../../../../types';
import { MoveWithMetadata } from '../../../../utils/movesUtils';
import { MoveCard } from './MoveCard';

interface MovesSectionProps {
  title: string;
  icon: string;
  description: string;
  moves: MoveWithMetadata[];
  colorClass: string;
  moveDetails: { [key: string]: Move };
  onLoadMoveDetail: (moveName: string) => void;
}

export function MovesSection({
  title,
  icon,
  description,
  moves,
  colorClass,
  moveDetails,
  onLoadMoveDetail
}: MovesSectionProps) {
  const gradientClasses = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600'
  };

  const textClasses = {
    green: 'text-green-100',
    blue: 'text-blue-100',
    purple: 'text-purple-100'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className={`bg-gradient-to-r ${gradientClasses[colorClass as keyof typeof gradientClasses]} text-white p-4`}>
        <div className="flex items-center space-x-2">
          <span className="text-xl">{icon}</span>
          <h4 className="text-lg font-bold">{title} ({moves.length})</h4>
        </div>
        <p className={`${textClasses[colorClass as keyof typeof textClasses]} text-sm mt-1`}>{description}</p>
      </div>
      <div className="p-4">
        {moves.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {moves.map((moveData, index) => (
              <MoveCard
                key={`${moveData.move.name}-${index}`}
                moveData={moveData}
                colorClass={colorClass}
                moveDetail={moveDetails[moveData.move.name]}
                onLoadDetail={onLoadMoveDetail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
            <div className="text-4xl mb-2">🤷‍♂️</div>
            <p>No {title.toLowerCase()} available</p>
          </div>
        )}
      </div>
    </div>
  );
}
