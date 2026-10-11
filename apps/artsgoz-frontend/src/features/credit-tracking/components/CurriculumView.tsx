import { useTranslation } from 'react-i18next';
import { MessageSquareWarning } from 'lucide-react';
import type { Subject, AcademicProfile } from '../types.js';

interface CurriculumViewProps {
  subjects?: Subject[];
  onToggleSubject?: (id: string) => void;
  profile?: AcademicProfile | null;
}

export function CurriculumView({ profile }: CurriculumViewProps) {
  const { t } = useTranslation();
  const majorName = profile?.major ?? 'credit_tracking.majors.default';
  const minorName = profile?.minor ?? 'credit_tracking.minors.default';

  const curriculumRows = [
    {
      part: t('credit_tracking.curriculum.major_title'),
      credits: 48,
      detail: t('credit_tracking.curriculum.major_details'),
    },
    {
      part: t('credit_tracking.curriculum.specific_courses'),
      credits: 18,
      detail: '',
      isIndented: true,
    },
    {
      part: t('credit_tracking.curriculum.basic_courses'),
      credits: 12,
      detail: '',
      isIndented: true,
    },
    {
      part: t('credit_tracking.curriculum.specialized_courses'),
      credits: 18,
      detail: '',
      isIndented: true,
    },
    {
      part: t('credit_tracking.curriculum.minor_title'),
      credits: 18,
      detail: minorName !== 'credit_tracking.minors.default' && minorName !== 'credit_tracking.minors.none'
        ? t('credit_tracking.curriculum.minor_name', { name: t(minorName) })
        : t('credit_tracking.curriculum.minor_desc_empty'),
    },
  ];

  return (
    <div
      className="w-full space-y-10 select-none min-w-0"
      style={{ fontFamily: 'ChulaCharasNew, sans-serif' }}
    >
      {/* ───── Top Section: Title + Curriculum Overview ───── */}
      <div className="flex flex-col gap-6 w-full max-w-[744px] min-w-0">
        <div>
          <h1
            className="text-black truncate"
            style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}
          >
            {t('credit_tracking.curriculum.title')}
          </h1>
        </div>

        {/* Curriculum overview table */}
        <div
          className="w-full overflow-auto rounded-[12px] border border-[#D0D0D1]/30"
          style={{ background: '#F7F8F9' }}
        >
          <table
            className="w-full text-black border-collapse"
            style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px', minWidth: '560px' }}
          >
            <thead>
              <tr style={{ backgroundColor: '#FCEFF4' }}>
                <th
                  className="border border-[#D0D0D1]/40 px-3 py-2 text-center font-bold"
                  colSpan={3}
                >
                  {t('credit_tracking.curriculum.general_ed')}
                  <br />
                  <span style={{ fontWeight: 400 }}>{t('credit_tracking.curriculum.credits_val', { count: 30 })}</span>
                </th>
                <th
                  className="border border-[#D0D0D1]/40 px-3 py-2 text-center font-bold"
                  colSpan={4}
                >
                  {t('credit_tracking.curriculum.specific_ed')}
                  <br />
                  <span style={{ fontWeight: 400 }}>{t('credit_tracking.curriculum.specific_credits_detail')}</span>
                </th>
                <th className="border border-[#D0D0D1]/40 px-3 py-2 text-center font-bold">
                  {t('credit_tracking.curriculum.free_choice')}
                  <br />
                  <span style={{ fontWeight: 400 }}>{t('credit_tracking.curriculum.credits_val', { count: 6 })}</span>
                </th>
              </tr>
              <tr style={{ backgroundColor: '#F0F0F0', fontSize: '13px' }}>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('credit_tracking.curriculum.general_sub1')}
                  <br />
                  {t('credit_tracking.curriculum.credits_val', { count: 12 })}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('credit_tracking.curriculum.general_sub2')}
                  <br />
                  {t('credit_tracking.curriculum.credits_val', { count: 12 })}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('credit_tracking.curriculum.general_sub3')}
                  <br />
                  {t('credit_tracking.curriculum.credits_val', { count: 6 })}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('credit_tracking.curriculum.basic_arts')}
                  <br />
                  {t('credit_tracking.curriculum.credits_val', { count: 27 })}
                </th>
                <th
                  className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal"
                  colSpan={2}
                >
                  {t('credit_tracking.curriculum.english_major_detail')}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center align-top whitespace-normal">
                  {t('credit_tracking.curriculum.other_majors_detail')}
                </th>
                <th className="border border-[#D0D0D1]/40 px-2 py-2 text-center" rowSpan={2} />
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              <tr>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center" colSpan={3}>
                  {t('credit_tracking.curriculum.general_12_credits')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {t('credit_tracking.curriculum.basic_arts_detail')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {t('credit_tracking.curriculum.major_range_detail')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {t('credit_tracking.curriculum.minor_18_credits')}
                </td>
                <td className="border border-[#D0D0D1]/40 px-2 py-2 align-top text-center whitespace-normal">
                  {t('credit_tracking.curriculum.other_major_credits')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ───── Information Section ───── */}
      <div className="flex flex-col gap-6 w-full min-w-0">
        {/* Info Header */}
        <div className="flex flex-col gap-3 min-w-0">
          <h2
            className="text-black truncate"
            style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px' }}
          >
            {t(majorName)}
          </h2>
          <p
            className="text-black break-words"
            style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
          >
            {t('credit_tracking.curriculum.req_details_desc')}
          </p>
        </div>

        {/* Curriculum Breakdown Table */}
        <div style={{ maxWidth: '649px' }} className="w-full min-w-0 overflow-auto">
          {/* Header row */}
          <div
            className="flex items-center justify-between pb-2 mb-1 min-w-[500px]"
            style={{ borderBottom: '1px solid #D0D0D1' }}
          >
            <span
              className="flex-1 text-black"
              style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
            >
              {t('credit_tracking.curriculum.col_component')}
            </span>
            <span
              className="w-[100px] text-center text-black"
              style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
            >
              {t('credit_tracking.curriculum.col_credits')}
            </span>
            <span
              className="flex-1 text-black text-right"
              style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
            >
              {t('credit_tracking.curriculum.col_details')}
            </span>
          </div>

          {/* Data rows */}
          {curriculumRows.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 min-w-[500px]"
              style={{
                borderBottom: idx < curriculumRows.length - 1 ? '1px solid #F0F0F0' : 'none',
              }}
            >
              <span
                className="flex-1 text-black truncate pr-2"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  paddingLeft: row.isIndented ? '32px' : '0',
                  color: row.isIndented ? '#6D6D6D' : '#000000',
                }}
              >
                {row.part}
              </span>
              <span
                className="w-[100px] text-center"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  color: row.isIndented ? '#6D6D6D' : '#000000',
                }}
              >
                {row.credits}
              </span>
              <span
                className="flex-1 text-right text-black truncate pl-2"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                }}
              >
                {row.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Orange Warning Banner */}
        <div
          className="flex items-center gap-3 w-full"
          style={{
            backgroundColor: '#EE8A50',
            borderRadius: '11px',
            padding: '12px 24px',
          }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#FDF0E9',
              borderRadius: '4px',
            }}
          >
            <MessageSquareWarning size={16} style={{ color: '#EE8A50' }} />
          </div>
          <span
            className="text-white break-words"
            style={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
          >
            {t('credit_tracking.curriculum.warning_note')}
          </span>
        </div>
      </div>
    </div>
  );
}
