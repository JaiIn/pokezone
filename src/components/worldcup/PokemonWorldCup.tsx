import React from 'react';
import { useTournament } from '../../hooks/useTournament';
import { TournamentSetup } from './TournamentSetup';
import { TournamentGame } from './TournamentGame';
import { TournamentResult } from './TournamentResult';

interface PokemonWorldCupProps {
  onClose: () => void;
}

export function PokemonWorldCup({ onClose }: PokemonWorldCupProps) {
  const tournament = useTournament();

  // Tournament size selection screen
  if (!tournament.selectedSize) {
    return (
      <TournamentSetup
        onSizeSelect={tournament.initializeTournament}
        onClose={onClose}
        loading={tournament.loading}
      />
    );
  }

  // Champion result screen
  if (tournament.champion) {
    return (
      <TournamentResult
        champion={tournament.champion}
        tournamentSize={tournament.selectedSize}
        onRestart={tournament.resetTournament}
        onClose={onClose}
      />
    );
  }

  // Game in progress
  if (tournament.currentPair) {
    return (
      <TournamentGame
        currentPair={tournament.currentPair}
        selectedSize={tournament.selectedSize}
        participants={tournament.participants}
        currentMatch={tournament.currentMatch}
        roundName={tournament.roundName}
        onPokemonSelect={tournament.handlePokemonSelect}
        onReset={tournament.resetTournament}
        onClose={onClose}
      />
    );
  }

  // Fallback (should not happen)
  return null;
}
