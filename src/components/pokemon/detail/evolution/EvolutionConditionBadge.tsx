import React from 'react';

interface EvolutionConditionBadgeProps {
  condition: string;
}

export function EvolutionConditionBadge({ condition }: EvolutionConditionBadgeProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{condition}</span>
      </div>
    </div>
  );
}
