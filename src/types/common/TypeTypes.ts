import { LanguageEntry } from '../common';

// PokeAPI 타입 정보 (Type endpoint)
export interface PokeType {
  id: number;
  name: string;
  names: LanguageEntry[];
  damage_relations: {
    no_damage_to: { name: string; url: string }[];
    half_damage_to: { name: string; url: string }[];
    double_damage_to: { name: string; url: string }[];
    no_damage_from: { name: string; url: string }[];
    half_damage_from: { name: string; url: string }[];
    double_damage_from: { name: string; url: string }[];
  };
}
