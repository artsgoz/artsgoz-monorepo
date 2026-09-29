import { useTranslation } from 'react-i18next';

export type ActiveTab = 'curriculum' | 'planner' | 'summary';

interface AcademicTrackerNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  showSummary: boolean;
}

export function AcademicTrackerNavBar({ activeTab, onTabChange, showSummary }: AcademicTrackerNavBarProps) {
  const { t } = useTranslation('credit_tracking');

  const tabs: { key: ActiveTab; labelKey: string }[] = [
    { key: 'curriculum', labelKey: 'navbar.curriculum' },
    { key: 'planner', labelKey: 'navbar.planner' },
    ...(showSummary ? [{ key: 'summary' as ActiveTab, labelKey: 'navbar.summary' }] : []),
  ];

  return (
    <div
      className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-none pb-1"
      style={{ minHeight: '56px' }}
    >
      {/* Background bar */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '52px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
        }}
      />

      {/* Tabs row — floats over the bar */}
      <div
        className="relative left-0 flex items-end gap-[16px]"
        style={{ minHeight: '56px' }}
      >
        {tabs.map(({ key, labelKey }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              id={`tab-${key}`}
              onClick={() => onTabChange(key)}
              className="cursor-pointer transition-all border-none outline-none whitespace-nowrap flex items-center justify-center"
              style={{
                padding: '14px 44px',
                minHeight: '54px',
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontSize: '21px',
                fontWeight: 700,
                lineHeight: '30px',
                color: isActive ? '#FFFFFF' : '#DE5D8F',
                backgroundColor: isActive ? '#DE5D8F' : '#FFFFFF',
                borderRadius: '14px 14px 0px 0px',
                boxShadow: isActive
                  ? '0px 4px 12px rgba(222, 93, 143, 0.35)'
                  : '0px 2px 6px rgba(0, 0, 0, 0.12)',
              }}
            >
              {t(labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
