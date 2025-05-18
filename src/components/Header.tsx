import React from 'react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white py-8 mb-8">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          PokeZone
        </h1>
      </div>
    </header>
  );
}
