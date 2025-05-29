import { Generation } from './Generation';

// 세대 데이터 상수
export const GENERATIONS: Generation[] = [
  { 
    id: 0, 
    name: "all", 
    koreanName: "모든 세대", 
    englishName: "All Generations",
    japaneseName: "全世代",
    startId: 1, 
    endId: 1025 
  },
  { 
    id: 1, 
    name: "generation-i", 
    koreanName: "1세대 (관동)", 
    englishName: "Generation I (Kanto)",
    japaneseName: "第1世代 (カントー)",
    startId: 1, 
    endId: 151 
  },
  { 
    id: 2, 
    name: "generation-ii", 
    koreanName: "2세대 (성도)", 
    englishName: "Generation II (Johto)",
    japaneseName: "第2世代 (ジョウト)",
    startId: 152, 
    endId: 251 
  },
  { 
    id: 3, 
    name: "generation-iii", 
    koreanName: "3세대 (호연)", 
    englishName: "Generation III (Hoenn)",
    japaneseName: "第3世代 (ホウエン)",
    startId: 252, 
    endId: 386 
  },
  { 
    id: 4, 
    name: "generation-iv", 
    koreanName: "4세대 (신오)", 
    englishName: "Generation IV (Sinnoh)",
    japaneseName: "第4世代 (シンオウ)",
    startId: 387, 
    endId: 493 
  },
  { 
    id: 5, 
    name: "generation-v", 
    koreanName: "5세대 (하나)", 
    englishName: "Generation V (Unova)",
    japaneseName: "第5世代 (イッシュ)",
    startId: 494, 
    endId: 649 
  },
  { 
    id: 6, 
    name: "generation-vi", 
    koreanName: "6세대 (칼로스)", 
    englishName: "Generation VI (Kalos)",
    japaneseName: "第6世代 (カロス)",
    startId: 650, 
    endId: 721 
  },
  { 
    id: 7, 
    name: "generation-vii", 
    koreanName: "7세대 (알로라)", 
    englishName: "Generation VII (Alola)",
    japaneseName: "第7世代 (アローラ)",
    startId: 722, 
    endId: 809 
  },
  { 
    id: 8, 
    name: "generation-viii", 
    koreanName: "8세대 (가라르)", 
    englishName: "Generation VIII (Galar)",
    japaneseName: "第8世代 (ガラル)",
    startId: 810, 
    endId: 905 
  },
  { 
    id: 9, 
    name: "generation-ix", 
    koreanName: "9세대 (팔데아)", 
    englishName: "Generation IX (Paldea)",
    japaneseName: "第9世代 (パルデア)",
    startId: 906, 
    endId: 1025 
  },
];
