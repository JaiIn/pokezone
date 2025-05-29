export interface PokemonSprites {
  front_default: string;
  front_shiny: string | null;
  other: {
    'official-artwork': {
      front_default: string;
      front_shiny?: string | null;
    };
  };
}