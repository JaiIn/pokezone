import React from 'react';
import { Pokemon } from '../../types/pokemon';
import { PokemonService } from '../../services/pokemonService';
import { TOURNAMENT_SIZES } from '../../utils/tournamentUtils';

interface TournamentResultProps {
  champion: Pokemon;
  tournamentSize: number;
  onRestart: () => void;
  onClose: () => void;
}

export function TournamentResult({ champion, tournamentSize, onRestart, onClose }: TournamentResultProps) {
  return (
    <div className="modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="modal-content max-w-md w-full p-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-yellow-600">🏆 Champion!</h2>
        <div className="mb-6">
          <img
            src={champion.sprites.other['official-artwork']?.front_default || champion.sprites.front_default}
            alt={PokemonService.getDisplayName(champion)}
            className="w-48 h-48 object-contain mx-auto mb-4"
          />
          <h3 className="text-2xl font-bold">
            {PokemonService.getDisplayName(champion)}
          </h3>
          <p className="text-muted mt-2">
            Winner of the {tournamentSize}-Pokemon tournament! 🎉
          </p>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-sm text-muted">
              Won after {tournamentSize - 1} total matches
            </div>
            <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              {TOURNAMENT_SIZES.find(t => t.value === tournamentSize)?.emoji} 
              {TOURNAMENT_SIZES.find(t => t.value === tournamentSize)?.label} Champion
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRestart}
            className="btn-primary flex-1"
          >
            Start Again
          </button>
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
