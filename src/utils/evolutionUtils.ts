export interface EvolutionPokemon {
  name: string;
  id: string;
  minLevel?: number;
  trigger?: string;
  item?: string;
  timeOfDay?: string;
  location?: string;
  friendship?: boolean;
  trade?: boolean;
}

export const STONE_NAMES: { [key: string]: string } = {
  'fire-stone': '🔥 불꽃의돌',
  'water-stone': '💧 물의돌',
  'thunder-stone': '⚡ 번개의돌',
  'leaf-stone': '🍃 잎의돌',
  'moon-stone': '🌙 달의돌',
  'sun-stone': '☀️ 태양의돌',
  'shiny-stone': '✨ 빛의돌',
  'dusk-stone': '🌒 어둠의돌',
  'dawn-stone': '🌅 각성의돌',
  'ice-stone': '❄️ 얼음의돌'
};

export const TIME_NAMES: { [key: string]: string } = {
  'day': '☀️ 낮 시간',
  'night': '🌙 밤 시간'
};

export const STAGE_LABELS: { [key: number]: string } = {
  0: '🥚 Basic',
  1: '🌱 Stage 1',
  2: '🌺 Stage 2'
};

export const getPokemonIdFromUrl = (url: string): string => {
  const match = url.match(/\/pokemon-species\/(\d+)\//);
  return match ? match[1] : '1';
};

export const getEvolutionCondition = (evolutionDetails: any[]): string => {
  if (!evolutionDetails || evolutionDetails.length === 0) {
    return '';
  }

  const detail = evolutionDetails[0];
  const conditions: string[] = [];

  if (detail.min_level) {
    conditions.push(`레벨 ${detail.min_level}`);
  }

  if (detail.item) {
    const itemName = detail.item.name;
    conditions.push(STONE_NAMES[itemName] || `🔸 ${itemName}`);
  }

  if (detail.time_of_day) {
    conditions.push(TIME_NAMES[detail.time_of_day] || detail.time_of_day);
  }

  if (detail.min_happiness) {
    conditions.push(`💕 친밀도 ${detail.min_happiness}+`);
  }

  if (detail.trigger?.name === 'trade') {
    conditions.push('🔄 교환 진화');
    if (detail.held_item) {
      conditions.push(`📦 ${detail.held_item.name} 소지`);
    }
  }

  if (detail.location) {
    conditions.push(`📍 특정 장소`);
  }

  if (detail.known_move) {
    conditions.push(`🎯 ${detail.known_move.name} 습득`);
  }

  if (detail.party_species) {
    conditions.push('👥 파티에 특정 포켓몬');
  }

  return conditions.length > 0 ? conditions.join(' • ') : '🌟 특수조건';
};

export const processEvolutionChain = (chain: any): EvolutionPokemon[][] => {
  const stages: EvolutionPokemon[][] = [];

  const traverse = (node: any, stageIndex: number) => {
    if (!stages[stageIndex]) {
      stages[stageIndex] = [];
    }

    const pokemon: EvolutionPokemon = {
      name: node.species.name,
      id: getPokemonIdFromUrl(node.species.url)
    };

    if (stageIndex > 0 && node.evolution_details && node.evolution_details.length > 0) {
      const detail = node.evolution_details[0];
      pokemon.minLevel = detail.min_level;
      pokemon.trigger = detail.trigger?.name;
      pokemon.item = detail.item?.name;
      pokemon.timeOfDay = detail.time_of_day;
      pokemon.location = detail.location?.name;
      pokemon.friendship = detail.min_happiness > 0;
      pokemon.trade = detail.trigger?.name === 'trade';
    }

    stages[stageIndex].push(pokemon);

    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((evolution: any) => {
        traverse(evolution, stageIndex + 1);
      });
    }
  };

  traverse(chain, 0);
  return stages;
};

export const formatEvolutionConditions = (pokemon: EvolutionPokemon): string => {
  const conditions: string[] = [];

  if (pokemon.minLevel) {
    conditions.push(`레벨 ${pokemon.minLevel}`);
  }

  if (pokemon.item) {
    conditions.push(STONE_NAMES[pokemon.item] || `🔸 ${pokemon.item}`);
  }

  if (pokemon.timeOfDay) {
    conditions.push(TIME_NAMES[pokemon.timeOfDay] || pokemon.timeOfDay);
  }

  if (pokemon.friendship) {
    conditions.push('💕 친밀도');
  }

  if (pokemon.trade) {
    conditions.push('🔄 교환');
  }

  if (pokemon.location) {
    conditions.push('📍 특정 장소');
  }

  return conditions.length > 0 ? conditions.join(' • ') : 'Evolution';
};

export const getStageLabel = (stageIndex: number): string => {
  return STAGE_LABELS[stageIndex] || `Stage ${stageIndex}`;
};
