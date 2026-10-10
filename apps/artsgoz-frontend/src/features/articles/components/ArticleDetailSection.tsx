import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_ARTICLES } from '../constants.js';
import { ArticleCard } from './ArticleCard.js';

export function ArticleDetailSection() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const article = MOCK_ARTICLES.find((a) => a.id === id);
  const otherArticles = MOCK_ARTICLES.filter((a) => a.id !== id);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-[28px] font-bold text-gray-800 font-serif mb-4">
          {t('articles.detail.not_found_title', { defaultValue: 'ไม่พบบทความนี้' })}
        </h2>
        <p className="text-gray-600 mb-6 font-serif">
          {t('articles.detail.not_found_desc', { defaultValue: 'บทความที่คุณต้องการเข้าชมอาจถูกลบหรือไม่มีอยู่จริง' })}
        </p>
        <button
          onClick={() => navigate('/articles')}
          className="font-serif px-6 py-2.5 rounded-[9999px] text-white font-bold bg-[#E992B4] hover:bg-[#DE5D8F] transition-colors cursor-pointer"
        >
          {t('articles.detail.back_to_all', { defaultValue: 'กลับสู่หน้าบทความทั้งหมด' })}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1065px] mx-auto px-4 lg:px-6 py-10 md:py-14 flex flex-col gap-12">

        {/* Back button — not in Figma but helpful UX */}
        <button
          onClick={() => navigate('/articles')}
          className="group flex items-center gap-2 text-[#DE5D8F] hover:text-pink-600 font-serif font-bold text-[16px] transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('articles.detail.back_to_articles', { defaultValue: 'กลับไปหน้าบทความ' })}</span>
        </button>

        {/* ── Article content section (Figma: Frame 6529, column gap:24px) ── */}
        <div className="flex flex-col gap-6 w-full">

          {/* Header block (Figma: Frame 6528, column gap:12px) */}
          <div className="flex flex-col gap-3 w-full">

            {/* Inner header (Figma: Frame 6520 > Frame 6516 > Frame 6172, column gap:15px) */}
            <div className="flex flex-col gap-[15px] w-full">

              {/* Title row: title + bookmark button (Figma: Frame 6171, row space-between) */}
              <div className="flex flex-row justify-between items-start gap-4 w-full">
                {/* Title: ChulaCharasNew, 36px, bold, lineHeight:48px */}
                <h1 className="font-serif text-[28px] md:text-[36px] font-bold leading-[36px] md:leading-[48px] text-black flex-1 break-words">
                  {t(article.title)}
                </h1>

                {/* Bookmark button: 33×33, bg:#F8C135, borderRadius:8px, bookmark icon 24×24 */}
                <button
                  type="button"
                  onClick={() => setIsBookmarked((prev) => !prev)}
                  aria-label="Bookmark article"
                  style={{
                    width: '33px',
                    height: '33px',
                    borderRadius: '8px',
                    backgroundColor: '#F8C135',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Bookmark
                    size={20}
                    fill={isBookmarked ? '#fff' : 'none'}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

            {/* Category badge (Figma: System banner, bg:#FCEFF4, text:#DE5D8F, padding:12px 24px, borderRadius:11px) */}
            <span
              className="font-sans font-normal text-[16px] leading-[100%] text-[#DE5D8F] w-fit"
              style={{
                backgroundColor: '#FCEFF4',
                borderRadius: '11px',
                padding: '12px 24px',
              }}
            >
              {t(article.category)}
            </span>

            {/* Author/Date (Figma: bg rgba(255,255,255,0.26), borderRadius:8px, column gap:4px, padding:4px 0) */}
            <div
              className="flex flex-col gap-[4px] w-fit py-[4px] px-0"
            >
              {/* Author: ChulaCharasNew, 16px, bold, #6D6D6D, row gap:11px */}
              <span className="font-serif font-bold text-[16px] leading-[24px] text-[#6D6D6D]">
                {t('articles.written_by', { author: t(article.author) })}
              </span>
              {/* Date: ChulaCharasNew, 16px, bold, #99999A */}
              <span className="font-serif font-bold text-[16px] leading-[24px] text-[#99999A]">
                {t('articles.published', { date: article.date })}
              </span>
            </div>
          </div>

          {/* Article banner image */}
          <div className="w-full aspect-[16/9] md:aspect-[21/8] rounded-[16px] overflow-hidden shadow-sm">
            <img
              src={article.imageUrl}
              alt={t(article.title)}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article body text (Figma: ChulaCharasNew, 16px, regular, black, lineHeight:24px) */}
          <article className="flex flex-col gap-6 w-full">
            {article.content && article.content.length > 0 ? (
              article.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="font-serif font-normal text-[16px] leading-[24px] text-black text-justify indent-8 break-words"
                >
                  {t(paragraph)}
                </p>
              ))
            ) : (
              <p className="font-serif font-normal text-[16px] leading-[24px] text-black text-justify break-words">
                {t(article.excerpt)}
              </p>
            )}
          </article>
        </div>

        {/* ── References section (Figma: Frame 6530, column gap:24px) ── */}
        <div className="flex flex-col gap-6 w-full">
          {/* "รายการอ้างอิง": ChulaCharasNew, 32px, bold, lineHeight:40px */}
          <h2 className="font-serif font-bold text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] text-black">
            {t('articles.detail.references', { defaultValue: 'รายการอ้างอิง' })}
          </h2>
          <div className="flex flex-col gap-2 text-[16px] leading-[24px] font-serif text-black">
            <p>1. คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย. (2567). <em>ประวัติคณะอักษรศาสตร์</em>. https://www.arts.chula.ac.th/</p>
            <p>2. สาราณียกร ก.อศ. (2566). <em>บทความวิชาการ ฉบับพิเศษ</em>. กรุงเทพฯ: สาราณียกร.</p>
          </div>
        </div>
      </div>

      {/* ── "อ่านต่อ" section (Figma: Frame 6519, column gap:65px, width:1181) ── */}
      <div className="w-full max-w-[1181px] mx-auto px-4 lg:px-6 pb-14 flex flex-col gap-10">
        {/* "อ่านต่อ": ChulaCharasNew, 32px, bold, lineHeight:40px, black */}
        <h2 className="font-serif font-bold text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] text-black">
          {t('articles.detail.read_more', { defaultValue: 'อ่านต่อ' })}
        </h2>

        {/* Horizontal scroll row (Figma: row, overflowScroll:x, gap:29px) */}
        <div
          className="flex flex-row gap-[29px] overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {otherArticles.map((a) => (
            <ArticleCard
              key={a.id}
              id={a.id}
              title={a.title}
              author={a.author}
              date={a.date}
              category={a.category}
              imageUrl={a.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

