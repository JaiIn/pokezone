import React from 'react';

interface NoEvolutionMessageProps {
  message?: string;
}

export function NoEvolutionMessage({ 
  message = "This Pokemon does not evolve" 
}: NoEvolutionMessageProps) {
  return (
    <div className="text-center mt-8">
      <div className="inline-flex items-center px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <span className="text-2xl mr-2">💎</span>
        <span className="text-amber-800 dark:text-amber-200 font-medium">{message}</span>
      </div>
    </div>
  );
}
