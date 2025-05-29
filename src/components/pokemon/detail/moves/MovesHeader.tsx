import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { t } from '../../../../utils/translations';

interface MovesHeaderProps {
  title?: string;
  subtitle?: string;
}

export function MovesHeader({ 
  title, 
  subtitle 
}: MovesHeaderProps) {
  const { language } = useLanguage();
  
  const defaultTitle = title || t('learnable_moves', language);
  const defaultSubtitle = subtitle || t('check_all_moves', language);
  return (
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">🎨</div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">{defaultTitle}</h3>
      <p className="text-muted mt-2">{defaultSubtitle}</p>
    </div>
  );
}
