import { EvolutionChain } from '../../types/pokemon';
import { PokemonApiService } from '../api/PokemonApiService';

export class EvolutionService {
  static async getEvolutionChain(url: string): Promise<EvolutionChain> {
    return PokemonApiService.getEvolutionChain(url);
  }

  static extractEvolutionChain(chain: EvolutionChain): string[][] {
    const evolutionStages: string[][] = [];
    
    const extractFromChain = (detail: any, stage: number = 0) => {
      if (!evolutionStages[stage]) {
        evolutionStages[stage] = [];
      }
      evolutionStages[stage].push(detail.species.name);
      
      if (detail.evolves_to && detail.evolves_to.length > 0) {
        detail.evolves_to.forEach((evolution: any) => {
          extractFromChain(evolution, stage + 1);
        });
      }
    };
    
    extractFromChain(chain.chain);
    return evolutionStages;
  }
}
