import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' }
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    console.log('🌍 언어 변경:', language, '->', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center space-x-1
            ${language === lang.code
              ? 'bg-white/20 text-white shadow-md'
              : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
            }
          `}
        >
          <span>{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
