import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { t } from '../../../../utils/translations';

interface EvolutionHeaderProps {
  title?: string;
  subtitle?: string;
}

export function EvolutionHeader({ 
  title, 
  subtitle 
}: EvolutionHeaderProps) {
  const { language } = useLanguage();
  
  const defaultTitle = title || t('evolution_chain', language);
  const defaultSubtitle = subtitle || t('check_evolution_stages', language);
  return (
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200">{defaultTitle}</h3>
      <p className="text-muted mt-2">{defaultSubtitle}</p>
    </div>
  );
}
