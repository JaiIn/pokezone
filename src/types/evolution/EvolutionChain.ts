import { EvolutionDetail } from './EvolutionDetail';

// 진화 체인 루트
export interface EvolutionChain {
  id: number;
  chain: EvolutionDetail;
}

// 진화 단계 (간단한 표현)
export interface EvolutionStage {
  name: string;
  id: number;
  level?: number;
}
