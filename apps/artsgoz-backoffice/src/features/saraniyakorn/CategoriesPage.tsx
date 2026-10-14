import { SaraniyakornLayout } from './SaraniyakornLayout';

// ─── Figma node 7786:39493 exact data ─────────────────────────────────────────

const CATEGORIES = [
  { name: 'วรรณกรรม', pct: 35, barW: 102, barColor: '#CA5582', dotColor: '#CA5582' },
  { name: 'ภาษา',     pct: 25, barW: 73,  barColor: '#DE5D8F', dotColor: '#DE5D8F' },
  { name: 'วัฒนธรรม', pct: 15, barW: 44,  barColor: '#E57DA5', dotColor: '#E57DA5' },
  { name: 'ปรัชญา',   pct: 12, barW: 35,  barColor: '#E992B4', dotColor: '#E992B4' },
  { name: 'วิจารณ์',  pct: 8,  barW: 23,  barColor: '#F0B4CB', dotColor: '#F0B4CB' },
  { name: 'ทั่วไป',   pct: 4,  barW: 15,  barColor: '#F5CDDC', dotColor: '#F5CDDC' },
  { name: 'อื่น ๆ',   pct: 1,  barW: 8,   barColor: '#FCEFF4', dotColor: '#FCEFF4' },
];

const TRENDING_ARTICLES = [
  { title: 'ความงามของความไม่สมบูรณ์แบบในวรรณกรรม…', views: '12.4k', author: 'โดย อนันต์ ร.' },
  { title: 'วิวัฒนาการของภาษาไทยในยุคดิจิทัล',       views: '9.8k',  author: 'โดย สุภาดา ด.' },
  { title: 'ปรัชญาการใช้ชีวิตแบบMinimalist จากมุมมองเซน', views: '7.2k', author: 'โดย เขมราช ต.' },
  { title: 'วัฒนธรรมการกิน: สะท้อนสังคมผ่านอาหารจานด่วน', views: '5.5k', author: 'โดย นภา ม.' },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export function CategoriesPage() {
  return (
    <SaraniyakornLayout>
      <div className="flex flex-col">
        {/* ════ MAIN HEADER (Figma Node 7786:39497) ════ */}
        <div style={{ marginBottom: 24 }}>
          <h1
            className="font-bold text-[#1A1C1C]"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 48,
              lineHeight: '64px',
              margin: 0,
            }}
          >
            หมวดหมู่ยอดนิยม
          </h1>
        </div>

        {/* ════ MAIN 2-COLUMN CARDS LAYOUT ════ */}
        <div className="flex items-start" style={{ gap: 24 }}>

          {/* ════ LEFT CARD: Category Count Circle on LEFT, Bars on RIGHT ════ */}
          <div
            className="shrink-0 flex flex-row items-center justify-between"
            style={{
              width: 500,
              minHeight: 608,
              borderRadius: 24,
              border: '1px solid #D4C2C2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.03)',
              padding: '24px 28px',
              gap: 28,
            }}
          >
            {/* Donut Chart Visual Representation (Moved to Left Side) */}
            <div
              className="relative flex items-center justify-center shrink-0"
              style={{
                width: 126,
                height: 125,
              }}
            >
              {/* SVG Ring Donut Chart */}
              <svg width="126" height="125" viewBox="0 0 126 125" className="absolute inset-0">
                <circle
                  cx="63"
                  cy="62.5"
                  r="52"
                  fill="none"
                  stroke="#E5EEFF"
                  strokeWidth="16"
                />
                {/* Segments matching category percentages */}
                <circle
                  cx="63"
                  cy="62.5"
                  r="52"
                  fill="none"
                  stroke="#CA5582"
                  strokeWidth="16"
                  strokeDasharray={`${326.7 * 0.35} 326.7`}
                  strokeDashoffset="0"
                  transform="rotate(-90 63 62.5)"
                />
                <circle
                  cx="63"
                  cy="62.5"
                  r="52"
                  fill="none"
                  stroke="#DE5D8F"
                  strokeWidth="16"
                  strokeDasharray={`${326.7 * 0.25} 326.7`}
                  strokeDashoffset={`${-326.7 * 0.35}`}
                  transform="rotate(-90 63 62.5)"
                />
                <circle
                  cx="63"
                  cy="62.5"
                  r="52"
                  fill="none"
                  stroke="#E57DA5"
                  strokeWidth="16"
                  strokeDasharray={`${326.7 * 0.15} 326.7`}
                  strokeDashoffset={`${-326.7 * 0.60}`}
                  transform="rotate(-90 63 62.5)"
                />
                <circle
                  cx="63"
                  cy="62.5"
                  r="52"
                  fill="none"
                  stroke="#E992B4"
                  strokeWidth="16"
                  strokeDasharray={`${326.7 * 0.12} 326.7`}
                  strokeDashoffset={`${-326.7 * 0.75}`}
                  transform="rotate(-90 63 62.5)"
                />
              </svg>
              {/* Center Donut Label */}
              <div className="flex flex-col items-center justify-center text-center z-10">
                <span
                  className="font-bold text-[#121C28]"
                  style={{
                    fontFamily: 'Be Vietnam Pro, sans-serif',
                    fontSize: 32,
                    lineHeight: '38px',
                  }}
                >
                  6
                </span>
                <span
                  className="font-medium text-[#504444]"
                  style={{
                    fontFamily: 'Loma, sans-serif',
                    fontSize: 12,
                    lineHeight: '12px',
                  }}
                >
                  หมวดหมู่
                </span>
              </div>
            </div>

            {/* Category Breakdown Bars (On the Right Side of Circle) */}
            <div className="flex flex-col flex-1" style={{ gap: 16 }}>
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="flex flex-col" style={{ gap: 4 }}>
                  <div className="flex items-center justify-between" style={{ height: 25 }}>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 9999,
                          backgroundColor: cat.dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="font-bold text-[#121C28]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 18,
                          lineHeight: '24px',
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <span
                      className="font-bold text-[#121C28]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 18,
                        lineHeight: '24px',
                      }}
                    >
                      {cat.pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 8,
                      borderRadius: 9999,
                      backgroundColor: '#E5EEFF',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.pct}%`,
                        height: 8,
                        borderRadius: 9999,
                        backgroundColor: cat.barColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════ RIGHT CARD: Trending List Card (No Underline, No Item Borders) ════ */}
          <div
            className="flex flex-col"
            style={{
              width: 435,
              minHeight: 689,
              borderRadius: 24,
              border: '1px solid #D4C2C2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.03)',
              padding: 24,
            }}
          >
            {/* Card Header (Underline removed) */}
            <div style={{ marginBottom: 20 }}>
              <h2
                className="font-bold text-[#121C28]"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 28,
                  lineHeight: '36px',
                  margin: 0,
                }}
              >
                บทความที่ได้รับความนิยมที่สุด
              </h2>
            </div>

            {/* Articles List Container (Borders removed) */}
            <div className="flex flex-col">
              {TRENDING_ARTICLES.map((article, idx) => (
                <div
                  key={idx}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    width: '100%',
                    minHeight: 90,
                    borderRadius: 12,
                    border: 'none',
                    padding: '8px 0',
                    marginBottom: idx < TRENDING_ARTICLES.length - 1 ? 16 : 0,
                  }}
                >
                  <p
                    className="font-bold text-[#121C28]"
                    style={{
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontSize: 18,
                      lineHeight: '24px',
                      margin: 0,
                      minHeight: 48,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {article.title}
                  </p>
                  <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span
                        className="font-bold text-[#504444]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 14,
                          lineHeight: '20px',
                        }}
                      >
                        👁 {article.views}
                      </span>
                    </div>
                    <span
                      className="font-bold text-[#504444]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 14,
                        lineHeight: '20px',
                      }}
                    >
                      {article.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </SaraniyakornLayout>
  );
}

export default CategoriesPage;
