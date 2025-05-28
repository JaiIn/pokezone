import React from 'react';

export function EmptyEvolutionState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">🔄</div>
      <p className="text-muted text-lg">Unable to load evolution information</p>
    </div>
  );
}
