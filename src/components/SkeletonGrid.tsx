import React from 'react';

interface SkeletonCardProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div className="pokemon-card overflow-hidden">
      <div className="p-6">
        <div className="text-right mb-2">
          <div className="h-4 w-8 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
        </div>
        
        <div className="flex justify-center mb-4 h-24 items-center">
          <div className="w-24 h-24 bg-gray-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="text-center mb-2">
          <div className="h-6 w-20 bg-gray-200 dark:bg-slate-600 rounded mx-auto animate-pulse"></div>
        </div>
        
        <div className="flex justify-center gap-2">
          <div className="h-6 w-12 bg-gray-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
          <div className="h-6 w-12 bg-gray-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 20 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
