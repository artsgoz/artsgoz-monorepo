import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Radio, MessageSquare, Link2 } from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';

interface ActivityItem {
  id: number;
  type: 'publish' | 'comment';
  action: string;
  timeAgo: string;
  articleTitle: string;
  content?: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    type: 'publish',
    action: 'เอ บีซีเผยแพร่บทความใหม่ ABCD',
    timeAgo: '10 นาทีที่แล้ว',
    articleTitle: '10 Ways to Graduate in 2025',
  },
  {
    id: 2,
    type: 'comment',
    action: 'ความคิดเห็นใหม่ในบทความ...',
    timeAgo: '4 ชั่วโมงที่แล้ว',
    articleTitle: '10 Ways to Graduate in 2025',
    content: 'เนื้อหามีประโยชน์มาก ๆ เลยค่ะ',
  },
  {
    id: 3,
    type: 'comment',
    action: 'ความคิดเห็นใหม่ในบทความ...',
    timeAgo: 'เมื่อวานนี้',
    articleTitle: '10 Ways to Graduate in 2025',
    content: 'เนื้อหามีประโยชน์มาก ๆ เลยค่ะ',
  },
];

const MORE_ACTIVITIES: ActivityItem[] = [
  {
    id: 4,
    type: 'publish',
    action: 'สมพร ศรีแสง เผยแพร่บทความใหม่ ปรัชญาสโตอิกกับการใช้ชีวิต',
    timeAgo: '2 วันที่แล้ว',
    articleTitle: 'ปรัชญาสโตอิกกับการใช้ชีวิต',
  },
  {
    id: 5,
    type: 'comment',
    action: 'ความคิดเห็นใหม่ในบทความ...',
    timeAgo: '3 วันที่แล้ว',
    articleTitle: 'ปรัชญาสโตอิกกับการใช้ชีวิต',
    content: 'อธิบายได้เข้าใจง่ายและเอาไปปรับใช้ได้จริงครับ',
  },
  {
    id: 6,
    type: 'publish',
    action: 'กานดา วู เผยแพร่บทความใหม่ วัฒนธรรมเอเชียตะวันออกเฉียงใต้',
    timeAgo: '5 วันที่แล้ว',
    articleTitle: 'วัฒนธรรมเอเชียตะวันออกเฉียงใต้',
  },
];

export function ActivitiesPage() {
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const filteredActivities = activities.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.action.toLowerCase().includes(q) ||
      item.articleTitle.toLowerCase().includes(q) ||
      (item.content && item.content.toLowerCase().includes(q))
    );
  });

  const handleLoadMore = () => {
    setActivities((prev) => [...prev, ...MORE_ACTIVITIES]);
    setHasMore(false);
  };

  return (
    <AksornsaraLayout
      showBackButton={true}
      onBack={() => navigate('/aksornsara')}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="w-full flex flex-col gap-8" style={{ maxWidth: 896 }}>
        {/* ── Page Title ── */}
        <div className="flex items-end justify-between">
          <h1
            className="font-bold text-[#1A1C1C]"
            style={{
              fontFamily: 'ChulaCharasNew, sans-serif',
              fontSize: 48,
              lineHeight: '64px',
              margin: 0,
            }}
          >
            กิจกรรมทั้งหมด
          </h1>
        </div>

        {/* ── Activity Cards List ── */}
        <div className="flex flex-col gap-6 w-full">
          {filteredActivities.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 border border-[#DFDFE0] text-center text-[#504444]">
              ไม่พบกิจกรรม
            </div>
          ) : (
            filteredActivities.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#DFDFE0] rounded-[16px] relative overflow-hidden flex flex-col transition-shadow hover:shadow-sm"
                style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                  padding: '24px 24px 20px 24px',
                }}
              >
                {/* Decorative Top Accent Gradient Bar */}
                <div
                  className="absolute top-0 left-[1px] right-[1px] h-[4px]"
                  style={{
                    background: 'linear-gradient(90deg, #F4C2C2 0%, #FFFFFF 100%)',
                  }}
                />

                {/* Card Top Row: Icon + Action & Time + Article Pill Badge */}
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Icon Badge & Action Info */}
                  <div className="flex items-start gap-3.5">
                    {/* Icon Badge */}
                    <div
                      className="flex items-center justify-center rounded-[8px] shrink-0 mt-0.5"
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: '#ECECEC',
                      }}
                    >
                      {item.type === 'publish' ? (
                        <Radio size={16} color="#9E4266" />
                      ) : (
                        <MessageSquare size={16} color="#9E4266" />
                      )}
                    </div>

                    {/* Action Text & Timestamp */}
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="font-bold text-[#121C28]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 16,
                          lineHeight: '22px',
                        }}
                      >
                        {item.action}
                      </span>
                      <span
                        className="text-[#6D6D6D]"
                        style={{
                          fontFamily: 'ChulaCharasNew, sans-serif',
                          fontSize: 13,
                          lineHeight: '18px',
                        }}
                      >
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Right: Article Pill Badge */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] shrink-0"
                    style={{ backgroundColor: '#ECECEC' }}
                  >
                    <Link2 size={12} color="#545455" />
                    <span
                      className="font-bold text-[#504444]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 12,
                        lineHeight: '18px',
                      }}
                    >
                      บทความ: {item.articleTitle}
                    </span>
                  </div>
                </div>

                {/* Comment Quote Block (if comment activity) */}
                {item.content && (
                  <div
                    className="mt-3.5 pl-4 border-l-2 border-[#DFDFE0]"
                    style={{ marginLeft: 45 }}
                  >
                    <p
                      className="text-[#121C28]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontWeight: 400,
                        fontSize: 15,
                        lineHeight: '22px',
                        margin: 0,
                      }}
                    >
                      "{item.content}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Load More Button */}
          {hasMore && filteredActivities.length > 0 && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                type="button"
                onClick={handleLoadMore}
                className="font-bold text-[#7B5455] hover:text-[#9E4266] bg-transparent border-none cursor-pointer transition-colors"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  lineHeight: '20px',
                }}
              >
                โหลดกิจกรรมทั้งหมดเพิ่มเติม
              </button>
            </div>
          )}
        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default ActivitiesPage;
