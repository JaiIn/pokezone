import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/translations';

interface TournamentInfoProps {
  roundName: string;
  currentMatch: number;
  totalMatches: number;
  remainingParticipants: number;
}

export function TournamentInfo({ roundName, currentMatch, totalMatches, remainingParticipants }: TournamentInfoProps) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="card p-4 text-center">
        <div className="text-sm text-muted">{t('current_round', language)}</div>
        <div className="text-xl font-bold">{roundName}</div>
      </div>
      <div className="card p-4 text-center">
        <div className="text-sm text-muted">{t('current_match', language)}</div>
        <div className="text-xl font-bold">
          {currentMatch + 1} / {totalMatches}
        </div>
      </div>
      <div className="card p-4 text-center">
        <div className="text-sm text-muted">{t('remaining_participants', language)}</div>
        <div className="text-xl font-bold">{remainingParticipants}</div>
      </div>
    </div>
  );
}
