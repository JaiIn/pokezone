import React from 'react';
import { TOURNAMENT_SIZES } from '../../utils/tournamentUtils';
import { LoadingSpinner } from '../LoadingSpinner';

interface TournamentSetupProps {
  onSizeSelect: (size: number) => void;
  onClose: () => void;
  loading: boolean;
}

export function TournamentSetup({ onSizeSelect, onClose, loading }: TournamentSetupProps) {
  return (
    <div className="modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="modal-content max-w-2xl w-full p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Pokemon World Cup 🏆</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg text-muted">
            Choose tournament size
          </p>
          <p className="text-sm text-muted mt-2">
            Larger tournaments feature more Pokemon and longer gameplay!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOURNAMENT_SIZES.map((size) => (
            <button
              key={size.value}
              onClick={() => onSizeSelect(size.value)}
              disabled={loading}
              className="p-6 rounded-lg border-2 border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 transform hover:scale-105 bg-white dark:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-4xl mb-3">{size.emoji}</div>
              <div className="text-xl font-bold mb-2">{size.label}</div>
              <div className="text-sm text-muted">
                {size.value} participants
              </div>
              <div className="text-xs text-muted mt-1">
                {size.value - 1} total matches
              </div>
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-8">
            <LoadingSpinner message="Recruiting Pokemon..." />
          </div>
        )}
      </div>
    </div>
  );
}
