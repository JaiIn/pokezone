import { Pokemon } from '../types';

export interface TournamentSize {
  value: number;
  label: string;
  key: string; // 번역 키 추가
  emoji: string;
}

export const TOURNAMENT_SIZES: TournamentSize[] = [
  { value: 16, label: 'Round of 16', key: 'round_of_16', emoji: '🥉' },
  { value: 32, label: 'Round of 32', key: 'round_of_32', emoji: '🥈' },
  { value: 64, label: 'Round of 64', key: 'round_of_64', emoji: '🥇' },
  { value: 128, label: 'Round of 128', key: 'round_of_128', emoji: '👑' },
  { value: 256, label: 'Round of 256', key: 'round_of_256', emoji: '🏆' }
];

export const generateRandomPokemonIds = (size: number): number[] => {
  const pokemonIds: number[] = [];
  const usedIds = new Set<number>();
  
  while (pokemonIds.length < size) {
    const id = Math.floor(Math.random() * 1025) + 1;
    if (!usedIds.has(id)) {
      pokemonIds.push(id);
      usedIds.add(id);
    }
  }
  
  return pokemonIds;
};

export const calculateProgress = (selectedSize: number, participants: Pokemon[], currentMatch: number) => {
  if (!selectedSize) return 0;
  const totalMatches = selectedSize - 1;
  const completedMatches = (selectedSize - participants.length) + currentMatch;
  return (completedMatches / totalMatches) * 100;
};

export const getRoundName = (remainingParticipants: number): string => {
  if (remainingParticipants === 256) return 'Round of 256';
  if (remainingParticipants === 128) return 'Round of 128';
  if (remainingParticipants === 64) return 'Round of 64';
  if (remainingParticipants === 32) return 'Round of 32';
  if (remainingParticipants === 16) return 'Round of 16';
  if (remainingParticipants === 8) return 'Quarterfinals';
  if (remainingParticipants === 4) return 'Semifinals';
  if (remainingParticipants === 2) return 'Finals';
  return '';
};

export const calculateRoundProgress = (currentMatch: number, totalParticipants: number): number => {
  return Math.round(((currentMatch + 1) / Math.ceil(totalParticipants / 2)) * 100);
};
