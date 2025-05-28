import React from 'react';

interface EvolutionHeaderProps {
  title?: string;
  subtitle?: string;
}

export function EvolutionHeader({ 
  title = "Evolution Chain", 
  subtitle = "Check the evolution stages and conditions of Pokemon" 
}: EvolutionHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">🧬</div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">{title}</h3>
      <p className="text-muted mt-2">{subtitle}</p>
    </div>
  );
}
