import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SectionHeading, Button } from '@artsgoz/design-system';
import { ArticleCard } from './ArticleCard.js';
import { MOCK_ARTICLES } from '../constants.js';
import { PATHS } from '../../../routes/paths.js';

export function ArticlesSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [isDown, setIsDown] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Momentum scrolling ref-based state
  const velocity = useRef(0);
  const lastX = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    // Stop any running inertia scrolling
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    setIsDown(true);
    setDragged(false);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);

    lastX.current = e.clientX;
    velocity.current = 0;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsHovered(false);

    // Apply smooth slide momentum on release
    if (Math.abs(velocity.current) > 1) {
      triggerMomentum();
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);

    // Apply smooth slide momentum on release
    if (Math.abs(velocity.current) > 1) {
      triggerMomentum();
    }
  };

  const triggerMomentum = () => {
    const decay = () => {
      if (!containerRef.current) return;
      containerRef.current.scrollLeft -= velocity.current * 1.2;
      velocity.current *= 0.95; // Decelerate over time
      if (Math.abs(velocity.current) > 0.3) {
        animationFrameId.current = requestAnimationFrame(decay);
      }
    };
    animationFrameId.current = requestAnimationFrame(decay);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update cursor position relative to viewport
    setMousePos({ x: e.clientX, y: e.clientY });

    if (!containerRef.current) return;

    if (!isDown) {
      return;
    }

    // Check if moved more than 5px to distinguish drag from click
    const moveX = Math.abs(e.clientX - dragStartPos.current.x);
    const moveY = Math.abs(e.clientY - dragStartPos.current.y);
    if (moveX > 5 || moveY > 5) {
      setDragged(true);
    }

    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed modifier
    containerRef.current.scrollLeft = scrollLeftState - walk;

    // Calculate instantaneous velocity for momentum scrolling
    velocity.current = e.clientX - lastX.current;
    lastX.current = e.clientX;
  };

  const handleCardClickCapture = (e: React.MouseEvent) => {
    if (dragged) {
      // Prevent click navigation if drag scroll was active
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Cleanup physics loop on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <section
      className={`w-full flex flex-col gap-8 relative select-none ${isHovered ? 'lg:cursor-none lg:[&_*]:cursor-none' : ''}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
        <SectionHeading
          title={t('articles.section_title')}
          description={t('articles.section_desc')}
        />
        <Link to={PATHS.ARTICLES} className="shrink-0">
          <Button variant="outline">{t('articles.view_all')}</Button>
        </Link>
      </div>

      {/* Horizontal scroll container with click-and-drag scrolling */}
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClickCapture={handleCardClickCapture}
        className="
          flex flex-row gap-6
          overflow-x-auto
          pb-6
          w-full
          scrollbar-none
          active:cursor-grabbing
        "
        style={{
          scrollBehavior: 'auto',
        }}
      >
        {MOCK_ARTICLES.map((article) => (
          <div key={article.id} className="shrink-0">
            <ArticleCard
              id={article.id}
              title={article.title}
              author={article.author}
              date={article.date}
              category={article.category}
              imageUrl={article.imageUrl}
            />
          </div>
        ))}
      </div>

      {/* Custom drag follower cursor with negative blending */}
      {isHovered && (
        <div
          className="hidden lg:flex fixed pointer-events-none z-[9999] items-center justify-center rounded-full bg-white text-black mix-blend-difference"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '72px',
            height: '72px',
            transform: `translate(-50%, -50%) scale(${isDown ? 0.9 : 1})`,
            transition: 'transform 0.1s ease-out',
            mixBlendMode: 'difference',
          }}
        >
          <span className="font-serif text-[11px] font-bold uppercase tracking-widest select-none">
            {isDown ? t('articles.dragging') : t('articles.drag')}
          </span>
        </div>
      )}
    </section>
  );
}
