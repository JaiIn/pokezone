import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { PokemonDex } from './components/PokemonDex';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <PokemonDex />
      </div>
    </ThemeProvider>
  );
}

export default App;
