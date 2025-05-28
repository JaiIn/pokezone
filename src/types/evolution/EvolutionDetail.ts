import { ApiReference } from '../common';
import { EvolutionTrigger } from './EvolutionTrigger';

// 진화 체인의 개별 단계
export interface EvolutionDetail {
  species: ApiReference;
  evolution_details: EvolutionTrigger[];
  evolves_to: EvolutionDetail[];
}
