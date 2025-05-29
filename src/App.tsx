import React, { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PokemonDex } from './components/PokemonDex';
import { TypeFormatter } from './services/formatters/TypeFormatter';
import { PokemonService } from './services/pokemonService';

function App() {
  useEffect(() => {
    // 앱 시작 시 주요 데이터들 미리 로딩
    const initializeData = async () => {
      try {
        // 타입 미리 로딩
        await TypeFormatter.preloadCommonTypes('ko');
        await TypeFormatter.preloadCommonTypes('ja');
        
        // 특성 미리 로딩 (한국어/일본어)
        await PokemonService.preloadAbilities('ko');
        await PokemonService.preloadAbilities('ja');
        
        // 기술 미리 로딩 (한국어/일본어)
        await PokemonService.preloadMoves('ko');
        await PokemonService.preloadMoves('ja');
      } catch (error) {
        console.warn('데이터 미리 로딩 실패:', error);
      }
    };
    
    initializeData();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="App">
          <PokemonDex />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
