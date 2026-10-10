import { useTranslation } from 'react-i18next';

export type ActiveTab = 'curriculum' | 'planner' | 'summary';

interface AcademicTrackerNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  showSummary: boolean;
}

export function AcademicTrackerNavBar({ activeTab, onTabChange, showSummary }: AcademicTrackerNavBarProps) {
  const { t } = useTranslation();

  const tabs: { key: ActiveTab; labelKey: string }[] = [
    { key: 'curriculum', labelKey: 'credit_tracking.navbar.curriculum' },
    { key: 'planner', labelKey: 'credit_tracking.navbar.planner' },
    ...(showSummary ? [{ key: 'summary' as ActiveTab, labelKey: 'credit_tracking.navbar.summary' }] : []),
  ];

  return (
    <div
      className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-none"
      style={{ height: '38px' }}
    >
      {/* Background bar */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '38px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
        }}
      />

      {/* Tabs row — floats over the bar */}
      <div
        className="absolute left-0 flex items-end gap-[16px]"
        style={{ bottom: 0, transform: 'translateY(0)' }}
      >
        {tabs.map(({ key, labelKey }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              id={`tab-${key}`}
              onClick={() => onTabChange(key)}
              className="cursor-pointer transition-all border-none outline-none whitespace-nowrap"
              style={{
                padding: '12px 32px md:padding: 12px 64px',
                fontFamily: 'ChulaCharasNew, sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '28px',
                color: isActive ? '#FFFFFF' : '#DE5D8F',
                backgroundColor: isActive ? '#E992B4' : '#FFFFFF',
                borderRadius: '12px 12px 0px 0px',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                paddingLeft: '32px',
                paddingRight: '32px',
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
