// 기본 목록 아이템
export interface ListItem {
  name: string;
  url: string;
}

// API 목록 응답 구조
export interface ListResponse<T = ListItem> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 포켓몬 목록 아이템 (ListItem과 동일하지만 명시적 타입)
export interface PokemonListItem {
  name: string;
  url: string;
}

// 포켓몬 목록 응답
export interface PokemonListResponse extends ListResponse<PokemonListItem> {}
