import React from 'react';

export type TabType = 'info' | 'evolution' | 'moves';

interface TabNavigationProps {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ selectedTab, onTabChange }: TabNavigationProps) {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'info', label: 'Basic Info' },
    { key: 'evolution', label: 'Evolution' },
    { key: 'moves', label: 'Moves' },
  ];

  return (
    <div className="border-b border-muted">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 font-medium ${
              selectedTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-muted hover:text-gray-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
