import { Generation } from './Generation';

// 세대 데이터 상수
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
