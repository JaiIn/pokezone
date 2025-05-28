import React from 'react';
import { MatchPair } from '../../hooks/useTournament';
import { Pokemon } from '../../types/pokemon';
import { PokemonBattleCard } from './PokemonBattleCard';
import { TournamentInfo } from './TournamentInfo';
import { TournamentProgress } from './TournamentProgress';

interface TournamentGameProps {
  currentPair: MatchPair;
  selectedSize: number;
  participants: Pokemon[];
  currentMatch: number;
  roundName: string;
  onPokemonSelect: (pokemon: Pokemon) => void;
  onReset: () => void;
  onClose: () => void;
}

export function TournamentGame({
  currentPair,
  selectedSize,
  participants,
  currentMatch,
  roundName,
  onPokemonSelect,
  onReset,
  onClose
}: TournamentGameProps) {
  const totalMatches = Math.ceil(participants.length / 2);

  return (
    <div className="modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="modal-content max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Pokemon World Cup 🏆</h2>
            <p className="text-muted">Choose your favorite Pokemon!</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onReset}
              className="btn-secondary text-sm"
            >
              Change Tournament
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <TournamentInfo
          roundName={roundName}
          currentMatch={currentMatch}
          totalMatches={totalMatches}
          remainingParticipants={participants.length}
        />

        <TournamentProgress
          selectedSize={selectedSize}
          participants={participants}
          currentMatch={currentMatch}
          roundName={roundName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PokemonBattleCard
            pokemon={currentPair.pokemon1}
            onSelect={onPokemonSelect}
          />
          <PokemonBattleCard
            pokemon={currentPair.pokemon2}
            onSelect={onPokemonSelect}
          />
        </div>
      </div>
    </div>
  );
}
