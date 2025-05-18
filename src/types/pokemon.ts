export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  names: Array<{
    language: {
      name: string;
      url: string;
    };
    name: string;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
}

export interface Generation {
  id: number;
  name: string;
  koreanName: string;
  startId: number;
  endId: number;
}

export const GENERATIONS: Generation[] = [
  { id: 0, name: "all", koreanName: "전체", startId: 1, endId: 1025 },
  { id: 1, name: "generation-i", koreanName: "1세대 (관동)", startId: 1, endId: 151 },
  { id: 2, name: "generation-ii", koreanName: "2세대 (성도)", startId: 152, endId: 251 },
  { id: 3, name: "generation-iii", koreanName: "3세대 (호연)", startId: 252, endId: 386 },
  { id: 4, name: "generation-iv", koreanName: "4세대 (신오)", startId: 387, endId: 493 },
  { id: 5, name: "generation-v", koreanName: "5세대 (하나)", startId: 494, endId: 649 },
  { id: 6, name: "generation-vi", koreanName: "6세대 (칼로스)", startId: 650, endId: 721 },
  { id: 7, name: "generation-vii", koreanName: "7세대 (알로라)", startId: 722, endId: 809 },
  { id: 8, name: "generation-viii", koreanName: "8세대 (가라르)", startId: 810, endId: 905 },
  { id: 9, name: "generation-ix", koreanName: "9세대 (팔데아)", startId: 906, endId: 1025 },
];
