import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import mockImage from '../../../assets/ArticleBannerMock.jpg';

interface ArticleCardProps {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  onBookmarkChange?: (id: string, bookmarked: boolean) => void;
}

export function ArticleCard({
  id,
  title,
  author,
  date,
  category,
  imageUrl,
  onBookmarkChange,
}: ArticleCardProps) {
  const { t } = useTranslation('articles');
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        return ids.includes(id);
      }
    } catch (e) {
      console.error('Failed to parse bookmarked_articles', e);
    }
    return false;
  });

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      let ids: string[] = [];
      if (saved) {
        ids = JSON.parse(saved) as string[];
      }
      if (nextState) {
        if (!ids.includes(id)) ids.push(id);
      } else {
        ids = ids.filter((savedId) => savedId !== id);
      }
      localStorage.setItem('bookmarked_articles', JSON.stringify(ids));
      if (onBookmarkChange) {
        onBookmarkChange(id, nextState);
      }
    } catch (err) {
      console.error('Failed to update bookmarked_articles', err);
    }
  };

  const translatedTitle = t(title);
  const translatedAuthor = t(author);
  const translatedCategory = t(category);

  return (
    <div
      onClick={() => navigate(`/articles/${id}`)}
      className="
        snap-start shrink-0 relative overflow-hidden
        bg-[#F7F8F9] rounded-[16px]
        shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.05)]
        cursor-pointer
        hover:shadow-lg hover:scale-[1.02] transition-all duration-300
        w-[315px] h-[391px]
        lg:w-[530px] lg:h-[356px]
      "
    >
      {/* === MOBILE LAYOUT (< lg): fully absolute, Figma spec === */}

      {/* Image: x:18, y:16, w:277, h:260, borderRadius:12px */}
      <div className="
        absolute top-[16px] left-[18px]
        w-[277px] h-[260px] rounded-[12px] overflow-hidden
        lg:hidden
      ">
        <img
          src={imageUrl || mockImage}
          alt={translatedTitle}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Title + Author/Date block: x:24, y:289, w:164 */}
      <div className="
        absolute left-[24px] top-[289px]
        w-[164px] flex flex-col gap-[4px]
        lg:hidden
      ">
        <h3 className="
          font-serif text-[16px] font-bold leading-[24px]
          text-black line-clamp-2 overflow-hidden text-ellipsis break-words w-full
        ">
          {translatedTitle}
        </h3>
        <div className="flex flex-col gap-[4px]">
          <span className="font-serif text-[14px] font-bold leading-[20px] text-[#6D6D6D] whitespace-nowrap overflow-hidden text-ellipsis">
            {t('written_by', { author: translatedAuthor })}
          </span>
          <span className="font-serif text-[14px] font-bold leading-[20px] text-[#99999A] whitespace-nowrap">
            {t('published', { date })}
          </span>
        </div>
      </div>

      {/* Category badge + Bookmark: x:188, y:289 */}
      <div className="
        absolute left-[188px] top-[289px]
        flex flex-row items-center gap-[9px]
        lg:hidden
      ">
        {/* Category badge: bg #FCEFF4, text #DE5D8F, 12px bold, padding 12px 24px, height 33px, borderRadius 11px */}
        <span
          className="font-serif font-bold text-[12px] leading-[18px] text-[#DE5D8F] whitespace-nowrap"
          style={{
            backgroundColor: '#FCEFF4',
            borderRadius: '11px',
            padding: '7px 12px',
            height: '33px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {translatedCategory}
        </span>
        {/* Bookmark button: bg #F8C135, 32×32, borderRadius 8px */}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          aria-label="Bookmark article"
          style={{
            width: '32px',
            height: '32px',
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
            size={16}
            fill={isBookmarked ? '#fff' : 'none'}
            stroke="#fff"
            strokeWidth={2}
          />
        </button>
      </div>

      {/* === DESKTOP LAYOUT (>= lg): absolutely positioned === */}

      {/* Image left panel */}
      <div className="
        hidden lg:block
        absolute left-[32px] top-[22px]
        w-[248px] h-[312px] rounded-[12px] overflow-hidden
      ">
        <img
          src={imageUrl || mockImage}
          alt={translatedTitle}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Category chip + Bookmark — top right on desktop */}
      <div className="hidden lg:flex absolute right-[22px] top-[22px] gap-[8px] items-center z-10">
        <span
          className="font-serif font-bold text-[12px] leading-[18px] text-[#DE5D8F] whitespace-nowrap"
          style={{
            backgroundColor: '#FCEFF4',
            borderRadius: '11px',
            padding: '7px 12px',
            height: '33px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {translatedCategory}
        </span>
        <button
          type="button"
          onClick={handleBookmarkToggle}
          aria-label="Bookmark article"
          style={{
            width: '40px',
            height: '40px',
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
            size={18}
            fill={isBookmarked ? '#fff' : 'none'}
            stroke="#fff"
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Text content — right panel on desktop */}
      <div className="
        hidden lg:flex flex-col gap-[17px] items-start
        absolute w-[194px] left-[304px] top-[107px]
      ">
        <h3 className="
          overflow-hidden text-ellipsis line-clamp-3
          font-serif text-[20px] font-bold leading-[28px]
          text-black break-words w-full h-[84px]
        ">
          {translatedTitle}
        </h3>
        <div className="bg-[rgba(255,255,255,0.26)] flex flex-col gap-[4px] items-start justify-center py-[4px] px-[12px] w-full rounded-[8px] overflow-hidden text-ellipsis">
          <span className="font-serif text-[14px] text-[#6D6D6D] font-bold leading-[20px] whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {t('written_by', { author: translatedAuthor })}
          </span>
          <span className="font-serif text-[14px] text-[#99999A] font-bold leading-[20px] whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {t('published', { date })}
          </span>
        </div>
      </div>
    </div>
  );
}
