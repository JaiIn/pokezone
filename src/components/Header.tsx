import React from 'react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 mb-8">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          포켓몬 도감
        </h1>
        <p className="text-xl opacity-90">
          PokeAPI로 만든 포켓몬 정보 도감
        </p>
      </div>
    </header>
  );
}
