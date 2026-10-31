import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Bookmark, ExternalLink, Clock, Feather, Edit3, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@artsgoz/design-system';
import { getArticleDetail, ARTICLES_SUMMARY, ArticleBannerMock } from '../constants.js';
import { ArticleCard } from './ArticleCard.js';

export function ArticleDetailSection() {
  const { t } = useTranslation('articles');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const article = useMemo(() => {
    return (id ? getArticleDetail(id) : undefined) || getArticleDetail('art-001');
  }, [id]);

  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      if (saved && article?.id) {
        const ids = JSON.parse(saved) as string[];
        return ids.includes(article.id);
      }
    } catch (e) {
      console.error('Failed to parse bookmarked_articles', e);
    }
    return false;
  });

  const [readMorePage, setReadMorePage] = useState(1);

  // Other articles for "อ่านต่อ" (prefer articles from the same year)
  const otherArticles = useMemo(() => {
    if (!article) return [];
    const sameYear = ARTICLES_SUMMARY.filter(
      (a) => a.id !== article.id && a.year === article.year
    );
    const diffYear = ARTICLES_SUMMARY.filter(
      (a) => a.id !== article.id && a.year !== article.year
    );
    return [...sameYear, ...diffYear];
  }, [article]);

  const READ_MORE_PER_PAGE = 4;
  const totalReadMorePages = Math.ceil(otherArticles.length / READ_MORE_PER_PAGE);
  const currentReadMoreArticles = otherArticles.slice(
    (readMorePage - 1) * READ_MORE_PER_PAGE,
    readMorePage * READ_MORE_PER_PAGE
  );

  const handleBookmarkToggle = () => {
    if (!article) return;
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      let ids: string[] = [];
      if (saved) {
        ids = JSON.parse(saved) as string[];
      }
      if (nextState) {
        if (!ids.includes(article.id)) ids.push(article.id);
      } else {
        ids = ids.filter((bid) => bid !== article.id);
      }
      localStorage.setItem('bookmarked_articles', JSON.stringify(ids));
    } catch (err) {
      console.error('Failed to update bookmarked_articles', err);
    }
  };

  if (!article) {
    return null;
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-8 md:py-14 flex flex-col gap-10">

        {/* Back navigation */}
        <button
          onClick={() => navigate('/articles')}
          className="group flex items-center gap-2 text-[#DE5D8F] hover:text-[#CA5582] font-serif font-bold text-[16px] transition-colors cursor-pointer w-fit border-none bg-transparent"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('detail.back_to_articles', { defaultValue: 'กลับไปหน้ารวมบทความ' })}</span>
        </button>

        {/* ── Top Hero Poster ── */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] aspect-[3/4] rounded-[16px] overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
            <img
              src={article.imageUrl || ArticleBannerMock}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── Article Header & Meta ── */}
        <div className="flex flex-col gap-3 w-full border-b border-gray-100 pb-6">
          {/* Title Row with Bookmark Button */}
          <div className="flex items-start justify-between gap-4 w-full">
            <h1 className="font-serif text-[26px] sm:text-[32px] md:text-[38px] font-bold leading-tight text-[#2B2B2B] flex-1 break-words">
              {article.title}
            </h1>

            <button
              type="button"
              onClick={handleBookmarkToggle}
              aria-label="Bookmark article"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[8px] bg-[#F8C135] text-white flex items-center justify-center shrink-0 cursor-pointer border-none hover:bg-[#DE5D8F] transition-colors shadow-xs"
            >
              <Bookmark
                size={20}
                fill={isBookmarked ? '#fff' : 'none'}
                stroke="#fff"
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Badges: Category & Read Time */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-serif font-bold text-[13px] sm:text-[14px] text-[#DE5D8F] bg-[#FCEFF4] rounded-[11px] px-3.5 py-1.5 w-fit">
              ปี {article.year}
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1.5 font-serif text-[13px] font-bold text-gray-500 bg-gray-100 rounded-[11px] px-3 py-1.5">
                <Clock size={14} className="text-gray-400" />
                ใช้เวลาอ่านประมาณ {article.readTime}
              </span>
            )}
          </div>

          {/* Author and Published Info */}
          <div className="text-[14px] sm:text-[15px] font-serif font-bold text-[#6D6D6D] flex flex-wrap items-center gap-2 pt-1">
            <span>{t('written_by', { author: article.author })}</span>
            <span>|</span>
            <span className="text-[#99999A]">สาราณียกร ฉบับปี {article.year}</span>
          </div>
        </div>

        {/* ── Article Body Text ── */}
        <article className="flex flex-col gap-6 w-full text-[16px] md:text-[18px] leading-[32px] text-[#2B2B2B] font-serif">
          {article.content && article.content.length > 0 ? (
            article.content.map((paragraph, index) => (
              <p key={index} className="indent-8 text-justify break-words">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="indent-8 text-justify break-words">
              {article.excerpt}
            </p>
          )}
        </article>

        {/* ── Editorial Credits Box ── */}
        <div className="w-full bg-[#FDF8FA] border border-[#F5CDDC] rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
          <h3 className="font-serif font-bold text-[18px] sm:text-[20px] text-[#404041] border-b border-[#F5CDDC]/60 pb-3">
            กองบรรณาธิการและผู้จัดทำบทความ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-[14px] sm:text-[15px] font-serif">
            <div className="flex items-start gap-2.5">
              <Feather size={18} className="text-[#DE5D8F] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-gray-400 text-[12px] font-bold">เนื้อหา / เขียนโดย</span>
                <span className="text-[#404041] font-bold">{article.author}</span>
              </div>
            </div>

            {article.proofreader && (
              <div className="flex items-start gap-2.5">
                <Edit3 size={18} className="text-[#DE5D8F] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[12px] font-bold">พิสูจน์อักษร</span>
                  <span className="text-[#404041] font-bold">{article.proofreader}</span>
                </div>
              </div>
            )}

            {article.illustrator && (
              <div className="flex items-start gap-2.5">
                <Image size={18} className="text-[#DE5D8F] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[12px] font-bold">ภาพ / ภาพประกอบ</span>
                  <span className="text-[#404041] font-bold">{article.illustrator}</span>
                </div>
              </div>
            )}
          </div>

          {article.url && (
            <div className="pt-2 border-t border-[#F5CDDC]/40 flex justify-end">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-serif font-bold text-[#DE5D8F] hover:underline"
              >
                <span>เปิดอ่านบนเว็บไซต์ต้นฉบับ Aksornsara.com</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* ── References Section ("รายการอ้างอิง") ── */}
        {article.references && article.references.length > 0 && (
          <div className="flex flex-col gap-4 w-full pt-6 border-t border-gray-200">
            <h2 className="font-serif font-bold text-[22px] sm:text-[26px] md:text-[28px] text-black">
              {t('detail.references', { defaultValue: 'รายการอ้างอิง' })}
            </h2>
            <div className="flex flex-col gap-2.5 font-serif text-[14px] sm:text-[15px] leading-[26px] text-[#4A4A4A] pl-4 border-l-2 border-[#DE5D8F]/30">
              {article.references.map((ref, idx) => (
                <p key={idx} className="break-words">
                  {ref}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── "อ่านต่อ" (Read More) Section ── */}
        <div className="flex flex-col gap-6 w-full pt-8 border-t border-gray-200">
          <h2 className="font-serif font-bold text-[22px] sm:text-[26px] md:text-[28px] text-black">
            {t('detail.read_more', { defaultValue: 'อ่านต่อบทความอื่น ๆ' })}
          </h2>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {currentReadMoreArticles.map((a) => (
              <ArticleCard
                key={a.id}
                id={a.id}
                title={a.title}
                author={a.author}
                date={a.date}
                category={a.category}
                imageUrl={a.imageUrl}
                compact={true}
              />
            ))}
          </div>

          {/* Pagination for "อ่านต่อ" */}
          {totalReadMorePages > 1 && (
            <div className="flex justify-center items-center w-full mt-4">
              <Pagination
                currentPage={readMorePage}
                totalPages={totalReadMorePages}
                onPageChange={(page) => setReadMorePage(page)}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
