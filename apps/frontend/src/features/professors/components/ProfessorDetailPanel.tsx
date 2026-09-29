import { useTranslation } from 'react-i18next';
import type { Professor } from '../types.js';

interface ProfessorDetailPanelProps {
  professor: Professor;
  onBack: () => void;
}

export function ProfessorDetailPanel({ professor, onBack }: ProfessorDetailPanelProps) {
  const { t } = useTranslation('student_services');

  return (
    <div
      className="bg-white border border-[#D0D0D1] rounded-xl flex flex-col overflow-y-auto w-full min-w-0"
      style={{ gap: '10px' }}
    >
      {/* Back button header */}
      <div
        className="flex items-center border-b border-[#BBBBBB] shrink-0"
        style={{ padding: '36px 37px', minHeight: '120px' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center border-none bg-transparent cursor-pointer"
          aria-label={t('professors.back')}
          style={{ width: '48px', height: '48px' }}
        >
          <svg
            width="12"
            height="24"
            viewBox="0 0 12 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 20L2 12L10 4"
              stroke="#DE5D8F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Content area */}
      <div className="flex flex-col px-[37px] pb-8 min-w-0" style={{ gap: '10px' }}>
        {/* Photo + name */}
        <div
          className="flex items-center flex-wrap md:flex-nowrap gap-4 md:gap-[94px]"
          style={{ minHeight: '192px', paddingTop: '10px' }}
        >
          <div
            className="rounded-full shrink-0 bg-[#D9D9D9]"
            style={{ width: '192px', height: '192px' }}
          />
          <span
            className="font-[ChulaCharasNew] text-[#DE5D8F] break-words"
            style={{ fontSize: '32px', fontWeight: 700, maxWidth: '100%' }}
          >
            {t(professor.nameKey)}
          </span>
        </div>

        {/* Info table rows */}
        <div className="flex flex-col mt-4 min-w-0" style={{ gap: '16px' }}>
          <InfoRow label={t('professors.abbreviation_label')} value={t(professor.abbreviationKey)} />
          <InfoRow label={t('professors.department_agency_label')} value={t(professor.departmentKey)} />
          <InfoRow label={t('professors.location_label')} value={t(professor.locationKey)} />
        </div>

        {/* Achievements section */}
        <InfoSection
          title={t('professors.achievements_label')}
          items={professor.achievementsKeys}
        />

        {/* Qualifications section */}
        <InfoSection title={t('professors.qualifications_label')} items={professor.qualificationsKeys} />

        {/* Courses section */}
        <InfoSection title={t('professors.courses_label')} items={professor.coursesKeys} />
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start md:items-center flex-col md:flex-row gap-2 md:gap-[35px]" style={{ minHeight: '36px' }}>
      <div className="flex items-center justify-start md:justify-center shrink-0" style={{ minWidth: '189px' }}>
        <span
          className="font-[ChulaCharasNew] text-[#DE5D8F] font-bold break-words"
          style={{ fontSize: '24px' }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center flex-1 min-w-0">
        <span
          className="font-[ChulaCharasNew] text-[#000000] break-words"
          style={{ fontSize: '20px', fontWeight: 400 }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  items: string[];
}

function InfoSection({ title, items }: InfoSectionProps) {
  const { t } = useTranslation('student_services');

  return (
    <div className="flex flex-col min-w-0" style={{ gap: '12px', marginTop: '10px' }}>
      <div className="flex items-center" style={{ minHeight: '30px' }}>
        <span
          className="font-[ChulaCharasNew] text-[#E57DA5] break-words"
          style={{ fontSize: '24px', fontWeight: 700 }}
        >
          {title}
        </span>
      </div>
      <div className="flex flex-col min-w-0" style={{ gap: '6px' }}>
        {items.map((itemKey, index) => (
          <div key={index} className="flex items-start" style={{ minHeight: '28px' }}>
            <span
              className="font-[ChulaCharasNew] text-[#000000] break-words"
              style={{ fontSize: '20px', fontWeight: 400 }}
            >
              {t(itemKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
