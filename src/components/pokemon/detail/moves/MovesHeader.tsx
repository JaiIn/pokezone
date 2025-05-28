import React from 'react';

interface MovesHeaderProps {
  title?: string;
  subtitle?: string;
}

export function MovesHeader({ 
  title = "Learnable Moves", 
  subtitle = "Check all moves this Pokemon can learn" 
}: MovesHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">🎨</div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">{title}</h3>
      <p className="text-muted mt-2">{subtitle}</p>
    </div>
  );
}
