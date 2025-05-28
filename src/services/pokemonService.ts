// 파사드 패턴으로 모든 서비스들을 조합
import { PokemonApiService } from './api/PokemonApiService';
import { PokemonFormatter } from './formatters/PokemonFormatter';
import { MoveFormatter } from './formatters/MoveFormatter';
import { PokemonSearchService } from './search/PokemonSearchService';
import { EvolutionService } from './evolution/EvolutionService';
import { GenerationService } from './generation/GenerationService';

export class PokemonService {
  // API 호출 위임
  static getPokemon = PokemonApiService.getPokemon;
  static getPokemonList = PokemonApiService.getPokemonList;
  static getPokemonSpecies = PokemonApiService.getPokemonSpecies;
  static getPokemonDetail = PokemonApiService.getPokemonDetail;
  static getMove = PokemonApiService.getMove;
  static getPokemonByGeneration = PokemonApiService.getPokemonByGeneration;
  
  // 포맷팅 위임
  static formatPokemonId = PokemonFormatter.formatPokemonId;
  static getDisplayName = PokemonFormatter.getDisplayName;
  static getFlavorText = PokemonFormatter.getFlavorText;
  static getTypeColor = PokemonFormatter.getTypeColor;
  static formatTypeName = PokemonFormatter.formatTypeName;
  static formatStatName = PokemonFormatter.formatStatName;
  static formatAbilityName = PokemonFormatter.formatAbilityName;
  
  // 기술 포맷팅 위임  
  static formatMoveName = MoveFormatter.formatMoveName;
  static formatSimpleMoveName = MoveFormatter.formatSimpleMoveName;
  static formatDamageClassName = MoveFormatter.formatDamageClassName;
  static formatLearnMethodName = MoveFormatter.formatLearnMethodName;
  
  // 검색 위임
  static searchPokemon = PokemonSearchService.searchPokemon;
  
  // 진화 위임
  static getEvolutionChain = EvolutionService.getEvolutionChain;
  static extractEvolutionChain = EvolutionService.extractEvolutionChain;
  
  // 세대 위임
  static getGenerationByPokemonId = GenerationService.getGenerationByPokemonId;
}
