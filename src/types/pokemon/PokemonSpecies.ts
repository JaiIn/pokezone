import { LanguageEntry, FlavorTextEntry } from '../common';

// 포켓몬 종족 정보
export interface PokemonSpecies {
  id: number;
  name: string;
  names: LanguageEntry[];
  flavor_text_entries: FlavorTextEntry[];
  evolution_chain: {
    url: string;
  };
}
