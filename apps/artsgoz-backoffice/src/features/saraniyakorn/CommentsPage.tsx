import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Link2 } from 'lucide-react';
import { SaraniyakornLayout } from './SaraniyakornLayout';

interface CommentItem {
  id: number;
  author: string;
  timeAgo: string;
  articleTitle: string;
  content: string;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 1,
    author: 'อรัญญา รักษาดี',
    timeAgo: '10 นาทีที่แล้ว',
    articleTitle: '10 Ways to Graduate in 2025',
    content: 'เนื้อหามีประโยชน์มาก ๆ เลยค่ะ',
  },
  {
    id: 2,
    author: 'อรัญญา รักษาดี',
    timeAgo: '30 นาทีที่แล้ว',
    articleTitle: '10 Ways to Graduate in 2025',
    content: 'เนื้อหามีประโยชน์มาก ๆ เลยค่ะ',
  },
  {
    id: 3,
    author: 'อรัญญา รักษาดี',
    timeAgo: '50 นาทีที่แล้ว',
    articleTitle: '10 Ways to Graduate in 2025',
    content: 'เนื้อหามีประโยชน์มาก ๆ เลยค่ะ',
  },
];

const MORE_COMMENTS: CommentItem[] = [
  {
    id: 4,
    author: 'สมพร ศรีแสง',
    timeAgo: '1 ชั่วโมงที่แล้ว',
    articleTitle: 'ปรัชญาสโตอิกกับการใช้ชีวิต',
    content: 'อธิบายได้เข้าใจง่ายและเอาไปปรับใช้ได้จริงครับ',
  },
  {
    id: 5,
    author: 'กิตติศักดิ์ เจริญสุข',
    timeAgo: '2 ชั่วโมงที่แล้ว',
    articleTitle: 'วัฒนธรรมเอเชียตะวันออกเฉียงใต้',
    content: 'ข้อมูลละเอียดและน่าสนใจมาก ขอบคุณสำหรับบทความดีๆ ครับ',
  },
];

export function CommentsPage() {
  const [search, setSearch] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const filteredComments = comments.filter(
    (c) =>
      c.author.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.articleTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoadMore = () => {
    setComments((prev) => [...prev, ...MORE_COMMENTS]);
    setHasMore(false);
  };

  return (
    <SaraniyakornLayout
      showBackButton={true}
      onBack={() => navigate('/saraniyakorn')}
      searchValue={search}
      onSearchChange={setSearch}
    >
      <div className="w-full flex flex-col gap-8" style={{ maxWidth: 956 }}>
        {/* ── Dashboard Header / Page Title ── */}
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
            คอมเมนต์ใหม่
          </h1>
        </div>

        {/* ── Comment Cards List ── */}
        <div className="flex flex-col gap-8 w-full" style={{ maxWidth: 896 }}>
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 border border-[#D4C2C2] text-center text-[#504444]">
              ไม่พบความคิดเห็น
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-[#D4C2C2] rounded-[16px] relative overflow-hidden flex flex-col"
                style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                  padding: '24px 21px 16px 21px',
                }}
              >
                {/* Decorative Top Accent Gradient Bar */}
                <div
                  className="absolute top-0 left-[1px] right-[1px] h-[4px]"
                  style={{
                    background: 'linear-gradient(90deg, #F4C2C2 0%, #FFFFFF 100%)',
                  }}
                />

                {/* Card Header: Author Info + Article Badge */}
                <div className="flex items-start justify-between gap-4">
                  {/* Author Name & Time */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="font-bold text-[#121C28]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 14,
                        lineHeight: '20px',
                      }}
                    >
                      {comment.author}
                    </span>
                    <span
                      className="font-bold text-[#504444]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 14,
                        lineHeight: '20px',
                      }}
                    >
                      {comment.timeAgo}
                    </span>
                  </div>

                  {/* Article Badge Pill */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px]"
                    style={{ backgroundColor: '#E5EEFF' }}
                  >
                    <Link2 size={12} color="#504444" />
                    <span
                      className="font-bold text-[#504444]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 12,
                        lineHeight: '18px',
                      }}
                    >
                      บทความ: {comment.articleTitle}
                    </span>
                  </div>
                </div>

                {/* Comment Content Block with Vertical Accent Border */}
                <div
                  className="my-4 pl-4 border-l-2 border-[#DFE9FA]"
                  style={{ minHeight: 30 }}
                >
                  <p
                    className="text-[#121C28]"
                    style={{
                      fontFamily: 'ChulaCharasNew, sans-serif',
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: '24px',
                      margin: 0,
                    }}
                  >
                    "{comment.content}"
                  </p>
                </div>

                {/* Card Bottom Divider & Action Button */}
                <div
                  className="pt-4 flex items-center justify-between"
                  style={{
                    borderTop: '1px solid rgba(212, 194, 194, 0.3)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F8F9FF] border border-[#D4C2C2] rounded-[8px] cursor-pointer hover:bg-[#F0F2FF] transition-colors"
                  >
                    <Trash2 size={14} color="#121C28" />
                    <span
                      className="font-medium text-[#121C28]"
                      style={{
                        fontFamily: 'Loma, sans-serif',
                        fontSize: 12,
                        lineHeight: '12px',
                        letterSpacing: '0.6px',
                      }}
                    >
                      ลบข้อความ
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Load More Button */}
          {hasMore && filteredComments.length > 0 && (
            <div className="flex justify-center pt-2 pb-6">
              <button
                type="button"
                onClick={handleLoadMore}
                className="font-bold text-[#7B5455] bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  fontFamily: 'ChulaCharasNew, sans-serif',
                  fontSize: 14,
                  lineHeight: '20px',
                }}
              >
                โหลดความคิดเห็นเพิ่มเติม
              </button>
            </div>
          )}
        </div>
      </div>
    </SaraniyakornLayout>
  );
}

export default CommentsPage;
