import React from 'react';
import { PokemonDetail, Move } from '../../../types/pokemon';
import { PokemonService } from '../../../services/pokemonService';

interface MovesListProps {
  fullDetail: PokemonDetail | null;
  moveDetails: { [key: string]: Move };
  onLoadMoveDetail: (moveName: string) => void;
}

export function MovesList({ fullDetail, moveDetails, onLoadMoveDetail }: MovesListProps) {
  if (!fullDetail?.moves) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">⚔️</div>
        <p className="text-muted text-lg">Unable to load move information</p>
      </div>
    );
  }

  // Filter and sort level-up moves
  const levelUpMoves = fullDetail.moves
    .filter(pokemonMove =>
      pokemonMove.version_group_details.some(
        detail => detail.move_learn_method.name === 'level-up'
      )
    )
    .map(pokemonMove => {
      const levelUpDetail = pokemonMove.version_group_details.find(
        detail => detail.move_learn_method.name === 'level-up'
      );
      return {
        move: pokemonMove.move,
        level: levelUpDetail?.level_learned_at || 0
      };
    })
    .sort((a, b) => a.level - b.level);

  // TM/TR moves
  const machineMoves = fullDetail.moves
    .filter(pokemonMove =>
      pokemonMove.version_group_details.some(
        detail => detail.move_learn_method.name === 'machine'
      )
    )
    .map(pokemonMove => ({
      move: pokemonMove.move,
      level: null
    }));

  // Other learning methods
  const otherMoves = fullDetail.moves
    .filter(pokemonMove =>
      pokemonMove.version_group_details.some(
        detail => detail.move_learn_method.name !== 'level-up' && detail.move_learn_method.name !== 'machine'
      )
    )
    .map(pokemonMove => {
      const otherDetail = pokemonMove.version_group_details.find(
        detail => detail.move_learn_method.name !== 'level-up' && detail.move_learn_method.name !== 'machine'
      );
      return {
        move: pokemonMove.move,
        method: otherDetail?.move_learn_method.name || 'unknown'
      };
    });

  const renderMoveCard = (move: any, level?: number | null, method?: string, colorClass = 'green') => (
    <div
      key={move.name}
      className={`group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer transition-all duration-200 border border-transparent hover:border-${colorClass}-300 dark:hover:border-${colorClass}-500`}
      onClick={() => onLoadMoveDetail(move.name)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-1 bg-${colorClass}-100 dark:bg-${colorClass}-900 text-${colorClass}-800 dark:text-${colorClass}-200 text-xs font-medium rounded-full`}>
          {level !== null ? `🌳 Level ${level}` : method ? `✨ ${PokemonService.formatLearnMethodName(method)}` : '🔧 TM'}
        </span>
        {moveDetails[move.name] && (
          <span
            className={`pokemon-type text-xs ${PokemonService.getTypeColor(moveDetails[move.name].type.name)}`}
          >
            {PokemonService.formatTypeName(moveDetails[move.name].type.name)}
          </span>
        )}
      </div>
      <div className={`font-medium capitalize text-gray-900 dark:text-slate-100 group-hover:text-${colorClass}-600 dark:group-hover:text-${colorClass}-400`}>
        {PokemonService.formatSimpleMoveName(move.name)}
      </div>
      {moveDetails[move.name] && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
            <span className="flex items-center">
              {moveDetails[move.name].power ? (
                <><span className="text-red-500">💥</span> Power: {moveDetails[move.name].power}</>
              ) : (
                <><span className="text-blue-500">🔘</span> {PokemonService.formatDamageClassName(moveDetails[move.name].damage_class.name)}</>
              )}
            </span>
            <span className="flex items-center">
              <span className="text-purple-500">⚡</span> PP: {moveDetails[move.name].pp}
            </span>
          </div>
          {moveDetails[move.name].accuracy && (
            <div className="text-xs text-gray-600 dark:text-slate-400">
              <span className="text-orange-500">🎯</span> Accuracy: {moveDetails[move.name].accuracy}%
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🎨</div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">Learnable Moves</h3>
        <p className="text-muted mt-2">Check all moves this Pokemon can learn</p>
      </div>

      <div className="space-y-8">
        {/* Level-up Moves */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌆</span>
              <h4 className="text-lg font-bold">Level-up Moves ({levelUpMoves.length})</h4>
            </div>
            <p className="text-green-100 text-sm mt-1">Moves learned naturally through leveling up</p>
          </div>
          <div className="p-4">
            {levelUpMoves.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {levelUpMoves.map(({ move, level }) => renderMoveCard(move, level, undefined, 'green'))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                <div className="text-4xl mb-2">🤷‍♂️</div>
                <p>No level-up moves available</p>
              </div>
            )}
          </div>
        </div>

        {/* TM/TR Moves */}
        {machineMoves.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔧</span>
                <h4 className="text-lg font-bold">TM/TR Moves ({machineMoves.length})</h4>
              </div>
              <p className="text-blue-100 text-sm mt-1">Moves that can be learned using Technical Machines</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {machineMoves.map(({ move }) => renderMoveCard(move, null, undefined, 'blue'))}
              </div>
            </div>
          </div>
        )}

        {/* Other Methods */}
        {otherMoves.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl">✨</span>
                <h4 className="text-lg font-bold">Special Moves ({otherMoves.length})</h4>
              </div>
              <p className="text-purple-100 text-sm mt-1">Moves learned through special methods</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {otherMoves.map(({ move, method }) => renderMoveCard(move, null, method, 'purple'))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">Move Learning Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{levelUpMoves.length}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Level-up Moves</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{machineMoves.length}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">TM/TR Moves</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{levelUpMoves.length + machineMoves.length + otherMoves.length}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Total Moves</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}