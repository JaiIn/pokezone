import { Move } from '../../types';

export class MoveFormatter {
  static formatMoveName(move: Move): string {
    const englishName = move.names.find(name => name.language.name === 'en');
    if (englishName) {
      return englishName.name;
    }
    
    return move.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  static formatSimpleMoveName(englishName: string): string {
    return englishName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  static formatDamageClassName(damageClass: string): string {
    return damageClass.charAt(0).toUpperCase() + damageClass.slice(1);
  }

  static formatLearnMethodName(method: string): string {
    return method.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}
