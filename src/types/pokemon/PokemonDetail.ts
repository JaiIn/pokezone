import { Pokemon } from './PokemonCore';
import { PokemonSpecies } from './PokemonSpecies';
import { EvolutionChain } from '../evolution';

// 확장된 포켓몬 상세 정보
export interface PokemonDetail extends Pokemon {
  species: PokemonSpecies;
  evolutionChain?: EvolutionChain;
}
