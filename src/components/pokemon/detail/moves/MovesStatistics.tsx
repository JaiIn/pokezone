import React from 'react';
import { MoveStats } from '../../../../utils/movesUtils';

interface MovesStatisticsProps extends MoveStats {}

export function MovesStatistics({ levelUpCount, machineCount, totalCount }: MovesStatisticsProps) {
  return (
    <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">Move Learning Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{levelUpCount}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">Level-up Moves</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{machineCount}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">TM/TR Moves</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalCount}</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">Total Moves</div>
          </div>
        </div>
      </div>
    </div>
  );
}
