import { useState, useEffect } from 'react';
import { Pokemon } from '../types';
import { PokemonService } from '../services/pokemonService';
import { generateRandomPokemonIds, getRoundName } from '../utils/tournamentUtils';

export interface MatchPair {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
}

export interface TournamentInfo {
  selectedSize: number | null;
  currentRound: number;
  currentMatch: number;
  participants: Pokemon[];
  winners: Pokemon[];
  currentPair: MatchPair | null;
  champion: Pokemon | null;
  roundName: string;
}

export function useTournament() {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [participants, setParticipants] = useState<Pokemon[]>([]);
  const [winners, setWinners] = useState<Pokemon[]>([]);
  const [currentPair, setCurrentPair] = useState<MatchPair | null>(null);
  const [loading, setLoading] = useState(false);
  const [champion, setChampion] = useState<Pokemon | null>(null);
  const [roundName, setRoundName] = useState('');

  // Update round name when participants change
  useEffect(() => {
    if (selectedSize && participants.length > 0) {
      setRoundName(getRoundName(participants.length));
    }
  }, [currentRound, participants, selectedSize]);

  const initializeTournament = async (size: number) => {
    setLoading(true);
    try {
      const pokemonIds = generateRandomPokemonIds(size);
      const pokemonPromises = pokemonIds.map(id => PokemonService.getPokemon(id));
      const pokemonList = await Promise.all(pokemonPromises);
      
      setParticipants(pokemonList);
      setSelectedSize(size);
      setCurrentRound(1);
      setCurrentMatch(0);
      setWinners([]);
      setChampion(null);
      setCurrentPair({
        pokemon1: pokemonList[0],
        pokemon2: pokemonList[1]
      });
    } catch (error) {
      console.error('Failed to initialize tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonSelect = (selectedPokemon: Pokemon) => {
    const newWinners = [...winners, selectedPokemon];
    const nextMatchIndex = currentMatch + 1;
    const pairIndex = nextMatchIndex * 2;

    if (pairIndex + 1 < participants.length) {
      // Next match
      setCurrentMatch(nextMatchIndex);
      setCurrentPair({
        pokemon1: participants[pairIndex],
        pokemon2: participants[pairIndex + 1]
      });
      setWinners(newWinners);
    } else {
      // Round complete
      if (newWinners.length === 1) {
        // Tournament complete
        setChampion(newWinners[0]);
        setCurrentPair(null);
      } else {
        // Next round
        setParticipants(newWinners);
        setWinners([]);
        setCurrentMatch(0);
        setCurrentRound(currentRound + 1);
        setCurrentPair({
          pokemon1: newWinners[0],
          pokemon2: newWinners[1]
        });
      }
    }
  };

  const resetTournament = () => {
    setSelectedSize(null);
    setCurrentRound(1);
    setCurrentMatch(0);
    setParticipants([]);
    setWinners([]);
    setCurrentPair(null);
    setChampion(null);
    setRoundName('');
  };

  const tournamentInfo: TournamentInfo = {
    selectedSize,
    currentRound,
    currentMatch,
    participants,
    winners,
    currentPair,
    champion,
    roundName
  };

  return {
    ...tournamentInfo,
    loading,
    initializeTournament,
    handlePokemonSelect,
    resetTournament
  };
}
