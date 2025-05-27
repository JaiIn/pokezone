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
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }>;
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
  evolution_chain: {
    url: string;
  };
}

// 진화 체인 관련 타입
export interface EvolutionChain {
  id: number;
  chain: EvolutionDetail;
}

export interface EvolutionDetail {
  species: {
    name: string;
    url: string;
  };
  evolution_details: Array<{
    min_level?: number;
    trigger: {
      name: string;
      url: string;
    };
    item?: {
      name: string;
      url: string;
    };
    time_of_day?: string;
    gender?: number;
    held_item?: {
      name: string;
      url: string;
    };
    known_move?: {
      name: string;
      url: string;
    };
    known_move_type?: {
      name: string;
      url: string;
    };
    location?: {
      name: string;
      url: string;
    };
    min_affection?: number;
    min_beauty?: number;
    min_happiness?: number;
    needs_overworld_rain?: boolean;
    party_species?: {
      name: string;
      url: string;
    };
    party_type?: {
      name: string;
      url: string;
    };
    relative_physical_stats?: number;
    trade_species?: {
      name: string;
      url: string;
    };
    turn_upside_down?: boolean;
  }>;
  evolves_to: EvolutionDetail[];
}

// 기술 관련 타입
export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

export interface Move {
  id: number;
  name: string;
  names: Array<{
    language: {
      name: string;
      url: string;
    };
    name: string;
  }>;
  power?: number;
  pp: number;
  accuracy?: number;
  priority: number;
  damage_class: {
    name: string;
    url: string;
  };
  type: {
    name: string;
    url: string;
  };
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
      url: string;
    };
    short_effect: string;
  }>;
}

// 확장된 포켓몬 상세 정보
export interface PokemonDetail extends Pokemon {
  species: PokemonSpecies;
  evolutionChain?: EvolutionChain;
  // moves는 Pokemon에서 상속받으므로 다시 정의하지 않음
}

// 진화 체인에서 간단한 진화 단계 추출
export interface EvolutionStage {
  name: string;
  id: number;
  level?: number;
}

export interface Generation {
  id: number;
  name: string;
  koreanName: string;
  startId: number;
  endId: number;
}

export const GENERATIONS: Generation[] = [
  { id: 0, name: "all", koreanName: "All Generations", startId: 1, endId: 1025 },
  { id: 1, name: "generation-i", koreanName: "Generation I (Kanto)", startId: 1, endId: 151 },
  { id: 2, name: "generation-ii", koreanName: "Generation II (Johto)", startId: 152, endId: 251 },
  { id: 3, name: "generation-iii", koreanName: "Generation III (Hoenn)", startId: 252, endId: 386 },
  { id: 4, name: "generation-iv", koreanName: "Generation IV (Sinnoh)", startId: 387, endId: 493 },
  { id: 5, name: "generation-v", koreanName: "Generation V (Unova)", startId: 494, endId: 649 },
  { id: 6, name: "generation-vi", koreanName: "Generation VI (Kalos)", startId: 650, endId: 721 },
  { id: 7, name: "generation-vii", koreanName: "Generation VII (Alola)", startId: 722, endId: 809 },
  { id: 8, name: "generation-viii", koreanName: "Generation VIII (Galar)", startId: 810, endId: 905 },
  { id: 9, name: "generation-ix", koreanName: "Generation IX (Paldea)", startId: 906, endId: 1025 },
];
