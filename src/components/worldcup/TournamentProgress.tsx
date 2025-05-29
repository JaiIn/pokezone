import React from 'react';
import { calculateProgress, calculateRoundProgress } from '../../utils/tournamentUtils';
import { Pokemon } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/translations';

interface TournamentProgressProps {
  selectedSize: number;
  participants: Pokemon[];
  currentMatch: number;
  roundName: string;
}

export function TournamentProgress({ selectedSize, participants, currentMatch, roundName }: TournamentProgressProps) {
  const { language } = useLanguage();
  const overallProgress = calculateProgress(selectedSize, participants, currentMatch);
  const roundProgress = calculateRoundProgress(currentMatch, participants.length);
  const remainingMatches = selectedSize - 1 - (selectedSize - participants.length) - currentMatch;

  return (
    <>
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{t('overall_progress', language)}</span>
          <span className="text-sm text-muted">
            {overallProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="text-xs text-muted mt-1">
          {t('remaining_matches', language)}: {remainingMatches}
        </div>
      </div>

      {/* Current Round Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{roundName} Progress</span>
          <span className="text-sm text-muted">
            {roundProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${roundProgress}%` }}
          />
        </div>
      </div>
    </>
  );
}
