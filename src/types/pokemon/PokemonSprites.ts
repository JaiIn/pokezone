// 포켓몬 스프라이트 이미지 구조
export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
  };
}
