import { Generation, GENERATIONS } from '../../types/pokemon';

export class GenerationService {
  static getGenerationByPokemonId(id: number): Generation | null {
    return GENERATIONS.find(gen => 
      gen.id !== 0 && id >= gen.startId && id <= gen.endId
    ) || null;
  }

  static getGenerationInfo(generationId: number): Generation {
    const generation = GENERATIONS.find(gen => gen.id === generationId);
    if (!generation) {
      throw new Error(`Generation with ID ${generationId} not found`);
    }
    return generation;
  }

  static getAllGenerations(): Generation[] {
    return GENERATIONS;
  }

  static getGenerationRange(generationId: number): { startId: number; endId: number } {
    const generation = this.getGenerationInfo(generationId);
    return {
      startId: generation.startId,
      endId: generation.endId
    };
  }
}
