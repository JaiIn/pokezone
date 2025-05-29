import React from 'react';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white py-8 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            PokeZone
          </h1>
          <div className="flex-1 flex justify-end">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}
