import { backendRequest } from '@base-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Link2, ExternalLink } from 'lucide-react';
import { AksornsaraLayout } from './AksornsaraLayout';

interface CommentItem {
  id: string;
  author: string;
  timeAgo: string;
  articleId: string;
  articleTitle: string;
  content: string;
}

export function CommentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const filteredComments = comments.filter(
    (c) =>
      c.author.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.articleTitle.toLowerCase().includes(search.toLowerCase()),
  );

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void backendRequest<{
      data: {
        id: string;
        author_name: string;
        content: string;
        article_id: string;
        article_title: string;
        created_at: string;
      }[];
    }>('/admin/comments', {}, true)
      .then((response) => {
        if (active)
          setComments(
            response.data.map((comment) => ({
              id: comment.id,
              author: comment.author_name,
              content: comment.content,
              articleId: comment.article_id,
              articleTitle: comment.article_title,
              timeAgo: new Date(comment.created_at).toLocaleString(),
            })),
          );
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : 'Unable to load comments.',
          );
      });
    return () => {
      active = false;
    };
  }, []);
  const handleDelete = async (id: string) => {
    try {
      await backendRequest(`/admin/comments/${id}`, { method: 'DELETE' }, true);
      setComments((previous) =>
        previous.filter((comment) => comment.id !== id),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to delete comment.',
      );
    }
  };
  const handleLoadMore = () => {
    setHasMore(false);
  };

  return (
    <AksornsaraLayout
      showBackButton={true}
      onBack={() => navigate('/aksornsara')}
      searchValue={search}
      onSearchChange={setSearch}
    >
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <div className="w-full flex flex-col gap-6" style={{ maxWidth: 956 }}>
        {/* ── Page Header ── */}
        <div>
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
        <div className="flex flex-col gap-6 w-full" style={{ maxWidth: 896 }}>
          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 border border-[#D4C2C2] text-center text-[#504444] font-serif">
              ไม่พบความคิดเห็นที่ค้นหา
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white border border-[#D4C2C2] rounded-[16px] relative overflow-hidden flex flex-col"
                style={{
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                  padding: '24px 24px 18px 24px',
                }}
              >
                {/* Decorative Top Accent Gradient Bar */}
                <div
                  className="absolute top-0 left-[1px] right-[1px] h-[4px]"
                  style={{
                    background:
                      'linear-gradient(90deg, #E992B4 0%, #FFFFFF 100%)',
                  }}
                />

                {/* Card Header: Author Info + Article Badge */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Author Name & Time */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="font-bold text-[#121C28]"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 18,
                        lineHeight: '24px',
                      }}
                    >
                      {comment.author}
                    </span>
                    <span
                      className="text-gray-500"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 13,
                        lineHeight: '18px',
                      }}
                    >
                      {comment.timeAgo}
                    </span>
                  </div>

                  {/* Article Badge Pill (Clickable) */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/aksornsara/create?id=${comment.articleId}`)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#FCEFF4] hover:bg-[#F9DEE8] transition-colors border-none cursor-pointer text-left max-w-[420px]"
                    title="คลิกเพื่อเปิดบทความนี้"
                  >
                    <Link2 size={13} color="#DE5D8F" className="shrink-0" />
                    <span
                      className="font-bold text-[#DE5D8F] truncate"
                      style={{
                        fontFamily: 'ChulaCharasNew, sans-serif',
                        fontSize: 13,
                        lineHeight: '18px',
                      }}
                    >
                      บทความ: {comment.articleTitle}
                    </span>
                    <ExternalLink
                      size={12}
                      color="#DE5D8F"
                      className="shrink-0 ml-0.5"
                    />
                  </button>
                </div>

                {/* Comment Content Block with Vertical Accent Border */}
                <div
                  className="my-4 pl-4 border-l-3 border-[#E992B4]"
                  style={{ minHeight: 28 }}
                >
                  <p
                    className="text-[#121C28] font-serif"
                    style={{
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
                  className="pt-3 flex items-center justify-between"
                  style={{
                    borderTop: '1px solid rgba(212, 194, 194, 0.3)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF5F7] border border-[#F5CDDC] rounded-[8px] cursor-pointer hover:bg-[#FCEFF4] transition-colors text-red-600 font-serif"
                    style={{ fontSize: 13 }}
                  >
                    <Trash2 size={13} />
                    <span>ลบความคิดเห็น</span>
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
                className="font-bold text-[#DE5D8F] bg-transparent border-none cursor-pointer hover:underline transition-opacity font-serif"
                style={{
                  fontSize: 15,
                  lineHeight: '22px',
                }}
              >
                โหลดความคิดเห็นเพิ่มเติม ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </AksornsaraLayout>
  );
}

export default CommentsPage;
