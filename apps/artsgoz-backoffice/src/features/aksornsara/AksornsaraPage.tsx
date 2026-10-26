import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Download,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Bell,
} from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: number;
  title: string;
  subtitle: string;
  status: string;
  views: number;
  thumb: string;
}

interface Activity {
  id: number;
  action: string;
  detail: string;
  time: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY_DATA = [
  { month: 'JAN', pct: 38 },
  { month: 'FEB', pct: 49 },
  { month: 'MAR', pct: 93 },
  { month: 'APR', pct: 66 },
  { month: 'MAY', pct: 75 },
  { month: 'JUN', pct: 100 },
];

const TOP_ARTICLES: Article[] = [
  { id: 1, title: 'ปรัชญาสโตอิกกับการใช้ชีวิต', subtitle: 'หมวด: ปรัชญา', status: 'เผยแพร่แล้ว', views: 12402, thumb: '#F5CDDC' },
  { id: 2, title: 'ประวัติศาสตร์ภาษาไทยและวิวัฒนาการ', subtitle: 'หมวด: ภาษา', status: 'เผยแพร่แล้ว', views: 8950, thumb: '#FCEFF4' },
  { id: 3, title: 'วัฒนธรรมเอเชียตะวันออกเฉียงใต้', subtitle: 'หมวด: วัฒนธรรม', status: 'เผยแพร่แล้ว', views: 7211, thumb: '#EAF4E7' },
  { id: 4, title: 'บทบาทของภาษาต่อการสร้างอัตลักษณ์', subtitle: 'หมวด: ภาษาศาสตร์', status: 'เผยแพร่แล้ว', views: 5890, thumb: '#F5CDDC' },
  { id: 5, title: 'ความงามในกวีนิพนธ์คลาสสิก', subtitle: 'หมวด: วรรณกรรม', status: 'ร่าง', views: 3104, thumb: '#F7F8F9' },
];

const RECENT_ACTIVITIES: Activity[] = [
  { id: 1, action: 'เอ บีซี เผยแพร่บทความใหม่เกี่ยวกับ', detail: '"text text textext"', time: '2 ชั่วโมงที่แล้ว' },
  { id: 2, action: 'ความคิดเห็นใหม่ในบทความ...', detail: '"text text textext"', time: '4 ชั่วโมงที่แล้ว' },
  { id: 3, action: 'ความคิดเห็นใหม่ในบทความ...', detail: 'โดย สมพร ศรีแสง', time: 'เมื่อวานนี้' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  badge?: string;
  iconBg: string;
  icon: React.ElementType;
  onClick?: () => void;
}

function MetricCard({ label, value, badge, iconBg, icon: Icon, onClick }: MetricCardProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className="bg-white rounded-[8px] p-6 flex flex-col transition-shadow text-left w-full"
      onClick={onClick}
      style={{
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        pointerEvents: 'all',
        border: 'none',
      }}
      onMouseEnter={onClick ? (e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0px 10px 24px -3px rgba(233,146,180,0.18), 0px 1px 3px 0px rgba(0,0,0,0.07)'; } : undefined}
      onMouseLeave={onClick ? (e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)'; } : undefined}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-8 h-8 rounded-[4px] flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={15} color="#6D6D6D" />
        </div>
        {badge && (
          <span
            className="text-[12px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#ECF4E7', color: '#64A93C' }}
          >
            ↑ {badge}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p
          className="font-bold text-[#6D6D6D]"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          {label}
        </p>
        <p
          className="font-bold mt-1"
          style={{
            fontFamily: 'Hanken Grotesk, Inter, sans-serif',
            fontSize: 24,
            lineHeight: '32px',
            color: '#000',
          }}
        >
          {value}
        </p>
      </div>
    </Tag>
  );
}

interface TopCategoryCardProps {
  onClick?: () => void;
}

function TopCategoryCard({ onClick }: TopCategoryCardProps) {
  return (
    <div
      className="bg-white rounded-[8px] p-6 flex flex-col transition-shadow cursor-pointer"
      onClick={onClick}
      style={{
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={onClick ? (e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0px 10px 24px -3px rgba(233,146,180,0.18), 0px 1px 3px 0px rgba(0,0,0,0.07)'; } : undefined}
      onMouseLeave={onClick ? (e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)'; } : undefined}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-8 h-8 rounded-[4px] flex items-center justify-center"
          style={{ backgroundColor: '#ECECEC' }}
        >
          <TrendingUp size={15} color="#6D6D6D" />
        </div>
      </div>
      <div className="mt-3">
        <p
          className="font-bold text-[#6D6D6D]"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          หมวดหมู่ยอดนิยม
        </p>
        <div className="flex items-baseline gap-1 mt-1 flex-wrap">
          <span className="font-bold" style={{ fontSize: 18, color: '#CA5582' }}>ปรัชญา</span>
          <span className="font-bold" style={{ fontSize: 14, color: '#E57DA5' }}>วัฒนธรรม</span>
          <span className="font-bold" style={{ fontSize: 11, color: '#E992B4' }}>ภาษา</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AksornsaraPage() {
  const [search, setSearch] = useState('');
  const BAR_MAX_H = 180;
  const navigate = useNavigate();

  return (
    <AksornsaraLayout showBackButton={false} searchValue={search} onSearchChange={setSearch}>
      <div className="w-full flex flex-col gap-8" style={{ maxWidth: 1100 }}>

        {/* ── Dashboard Header ── */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 w-full"
          style={{ maxWidth: 956 }}
        >
          <h1
            className="font-bold text-[#1A1C1C] text-[32px] md:text-[48px] leading-tight m-0"
          >
            Dashboard Overview
          </h1>
          <button
            type="button"
            className="flex items-center gap-1.5 text-white font-bold cursor-pointer border-none"
            style={{
              fontSize: 13,
              backgroundColor: '#E992B4',
              borderRadius: 9999,
              height: 40,
              padding: '0 24px',
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
            }}
          >
            <Download size={11} />
            ส่งออกข้อมูล
          </button>
        </div>

        {/* ── Key Metrics Row ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full"
        >
          <MetricCard label="ยอดเข้าชมทั้งหมด" value="125.4k" badge="12%" iconBg="#F5CDDC" icon={Eye} onClick={() => navigate('/aksornsara/traffic')} />
          <TopCategoryCard onClick={() => navigate('/aksornsara/categories')} />
          <MetricCard label="บทความที่เผยแพร่แล้ว" value="42" iconBg="#F5CDDC" icon={FileText} onClick={() => navigate('/aksornsara/published-articles')} />
          <MetricCard label="คอมเมนต์ใหม่" value="85" badge="8%" iconBg="#FCEFF4" icon={MessageSquare} onClick={() => navigate('/aksornsara/comments')} />
        </div>

        {/* ── Bottom content row ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

          {/* Left column */}
          <div className="flex flex-col gap-6 w-full lg:flex-1 min-w-0">

            {/* Traffic Overview Chart */}
            <div
              className="bg-white rounded-[8px] w-full"
              style={{
                maxWidth: 629,
                padding: '24px 24px 48px',
                boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
              }}
            >
              {/* Chart header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex flex-col gap-0">
                  <span
                    className="font-bold text-black"
                    style={{ fontSize: 22, lineHeight: '30px' }}
                  >
                    ภาพรวมการเข้าชม
                  </span>
                  <span
                    style={{ fontSize: 16, color: '#9E4266', fontWeight: 400 }}
                  >
                    แนวโน้มจำนวนผู้เข้าชมรายเดือน
                  </span>
                </div>
              </div>

              {/* Bar chart */}
              <div
                className="relative"
                style={{ height: BAR_MAX_H + 32 }}
              >
                {/* Horizontal grid lines */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute w-full"
                    style={{
                      bottom: 24 + (i / 3) * BAR_MAX_H,
                      borderTop: '1px solid #DFDFE0',
                      left: 0,
                    }}
                  />
                ))}

                {/* Bars + labels */}
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2"
                  style={{ height: BAR_MAX_H + 24 }}
                >
                  {MONTHLY_DATA.map((d) => {
                    const h = Math.round((d.pct / 100) * BAR_MAX_H);
                    const isMax = d.pct === 100;
                    return (
                      <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className="w-full rounded-t-[3px] transition-all"
                          style={{
                            height: h,
                            backgroundColor: isMax ? '#E992B4' : '#F5CDDC',
                            minWidth: 28,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: '#9E4266',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {d.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Performing Articles Table */}
            <div
              className="bg-white rounded-[8px] overflow-hidden"
              style={{
                width: 711,
                boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)',
              }}
            >
              {/* Table top bar */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid #DFDFE0' }}
              >
                <span className="font-bold text-black" style={{ fontSize: 22, lineHeight: '30px' }}>
                  บทความยอดนิยม
                </span>
                <span className="font-bold text-[#6D6D6D]" style={{ fontSize: 12 }}>
                  เดือนนี้
                </span>
              </div>

              {/* Column headers */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: '1fr 132px 102px 110px',
                  backgroundColor: '#F7F8F9',
                }}
              >
                {[
                  { label: 'ชื่อบทความ', align: 'left' as const, onClick: undefined as (() => void) | undefined },
                  { label: 'สถานะ', align: 'center' as const, onClick: undefined as (() => void) | undefined },
                  { label: 'ยอดเข้าชม', align: 'center' as const, onClick: () => navigate('/aksornsara/traffic') },
                  { label: '', align: 'center' as const, onClick: undefined as (() => void) | undefined },
                ].map((col, i) => (
                  <div
                    key={i}
                    className="py-4 px-6 font-bold text-[#6D6D6D]"
                    style={{ fontSize: 14, textAlign: col.align }}
                  >
                    {col.onClick ? (
                      <button
                        type="button"
                        onClick={col.onClick}
                        className="hover:text-[#9E4266] transition-colors cursor-pointer border-none bg-transparent p-0 font-bold"
                        style={{ fontSize: 14, color: 'inherit', fontFamily: 'inherit' }}
                      >
                        {col.label}
                      </button>
                    ) : (
                      col.label
                    )}
                  </div>
                ))}
              </div>

              {/* Article rows */}
              {TOP_ARTICLES.map((art, idx) => (
                <div
                  key={art.id}
                  className="grid items-center hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  onClick={() => navigate('/aksornsara/articles')}
                  style={{
                    gridTemplateColumns: '1fr 132px 102px 110px',
                    borderTop: idx > 0 ? '1px solid #DFDFE0' : 'none',
                  }}
                >
                  {/* Article title + thumbnail */}
                  <div className="flex items-center gap-4 px-6 py-4">
                    <div
                      className="shrink-0 rounded-[2px]"
                      style={{ width: 48, height: 48, backgroundColor: art.thumb }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-black truncate" style={{ fontSize: 14 }}>
                        {art.title}
                      </span>
                      <span className="text-[#6D6D6D]" style={{ fontSize: 12 }}>
                        {art.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="px-6 py-4 text-center">
                    <span
                      className="font-bold"
                      style={{
                        fontSize: 16,
                        color: art.status === 'เผยแพร่แล้ว' ? '#000' : '#6D6D6D',
                      }}
                    >
                      {art.status}
                    </span>
                  </div>

                  {/* Views */}
                  <div className="px-6 py-4 text-center">
                    <span className="font-bold text-black" style={{ fontSize: 18 }}>
                      {art.views.toLocaleString()}
                    </span>
                  </div>

                  {/* Action button */}
                  <div className="px-6 py-4 flex justify-center">
                    <button
                      type="button"
                      className="p-2 rounded-full hover:bg-[#F0F0F0] cursor-pointer border-none bg-transparent transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/aksornsara/articles');
                      }}
                    >
                      <MoreHorizontal size={16} color="#6D6D6D" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Panel */}
          <div
            className="bg-white rounded-[8px] shrink-0 w-full lg:w-[303px]"
            style={{
              minHeight: 478,
              boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.02), 0px 1px 3px 0px rgba(0,0,0,0.05)',
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <span className="font-bold text-black" style={{ fontSize: 22, lineHeight: '30px' }}>
                กิจกรรมล่าสุด
              </span>
              <span
                className="font-bold text-[#6D6D6D] cursor-pointer hover:text-[#9E4266] transition-colors"
                style={{ fontSize: 14 }}
                onClick={() => navigate('/aksornsara/activities')}
              >
                ดูทั้งหมด
              </span>
            </div>

            {/* Activity feed timeline */}
            <div className="flex flex-col px-6 pb-6">
              {RECENT_ACTIVITIES.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex gap-3 cursor-pointer group"
                  onClick={() => navigate('/aksornsara/activities')}
                >
                  <div className="flex flex-col items-center" style={{ width: 32 }}>
                    <div
                      className="flex items-center justify-center rounded-[12px] shrink-0 group-hover:bg-[#F5CDDC] transition-colors"
                      style={{ width: 32, height: 32, backgroundColor: '#ECECEC' }}
                    >
                      <Bell size={12} color="#9E4266" />
                    </div>
                    {idx < RECENT_ACTIVITIES.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          backgroundColor: '#DFDFE0',
                          minHeight: 28,
                        }}
                      />
                    )}
                  </div>

                  <div className="flex flex-col pb-5 flex-1 min-w-0">
                    <span className="font-bold text-black leading-snug group-hover:text-[#9E4266] transition-colors" style={{ fontSize: 16 }}>
                      {item.action}
                    </span>
                    <span className="text-[#404041] mt-0.5" style={{ fontSize: 13 }}>
                      {item.detail}
                    </span>
                    <span className="text-[#6D6D6D] mt-1" style={{ fontSize: 13 }}>
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AksornsaraLayout>
  );
}

export { AksornsaraPage as SaraniyakornPage };
export default AksornsaraPage;
