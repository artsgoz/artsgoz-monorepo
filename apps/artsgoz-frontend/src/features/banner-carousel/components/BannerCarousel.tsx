import { useTranslation } from 'react-i18next';
import { BannerCarouselProps } from '../types.js';
import { useBannerCarousel } from '../hooks/useBannerCarousel.js';

export function BannerCarousel({
  banners,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const { t } = useTranslation();
  const {
    displayIndex,
    isTransitioning,
    goToSlide,
    handleTransitionEnd,
  } = useBannerCarousel(banners.length, autoPlayInterval);

  if (!banners || banners.length === 0) return null;

  const hasMultiple = banners.length > 1;
  const slides = hasMultiple
    ? [banners[banners.length - 1], ...banners, banners[0]]
    : banners;

  const handleScrollDown = () => {
    const nextSection = document.getElementById('student-services-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const bannerContainer = document.querySelector('section.w-full.h-full')?.parentElement;
    if (bannerContainer) {
      const fallbackSection = bannerContainer.nextElementSibling;
      if (fallbackSection) {
        fallbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex justify-center relative min-w-0">
      <div className="relative overflow-hidden w-full h-full group bg-background-subtle">
        <div
          className="absolute inset-0 flex transition-transform"
          style={{
            transform: `translateX(-${displayIndex * 100}%)`,
            transitionDuration: isTransitioning ? '800ms' : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((banner, index) => {
            const getBannerDetails = (id: string, alt: string) => {
              switch (id) {
                case 'banner-01':
                  return {
                    gradient: 'from-[#f7f8f9] via-[#ececec] to-[#d0d0d1]',
                    title: t('banners.banner01.title'),
                    subtitle: t('banners.banner01.subtitle'),
                    description: t('banners.banner01.description'),
                    tag: t('banners.banner01.tag'),
                    textColor: 'text-[#404041]',
                    subColor: 'text-[#6d6d6d]',
                    descColor: 'text-[#6d6d6d]',
                    tagBg: 'bg-[#404041]/10 text-[#404041] border-[#404041]/20',
                    dotColor: 'bg-[#99999a]/20'
                  };
                case 'banner-02':
                  return {
                    gradient: 'from-[#f0f1f2] via-[#dfdfe0] to-[#c5c5c7]',
                    title: t('banners.banner02.title'),
                    subtitle: t('banners.banner02.subtitle'),
                    description: t('banners.banner02.description'),
                    tag: t('banners.banner02.tag'),
                    textColor: 'text-[#404041]',
                    subColor: 'text-[#545455]',
                    descColor: 'text-[#6d6d6d]',
                    tagBg: 'bg-[#545455]/10 text-[#545455] border-[#545455]/20',
                    dotColor: 'bg-[#8b8b8c]/20'
                  };
                case 'banner-03':
                  return {
                    gradient: 'from-[#e8e9ea] via-[#d0d0d1] to-[#b0b0b2]',
                    title: t('banners.banner03.title'),
                    subtitle: t('banners.banner03.subtitle'),
                    description: t('banners.banner03.description'),
                    tag: t('banners.banner03.tag'),
                    textColor: 'text-[#404041]',
                    subColor: 'text-[#545455]',
                    descColor: 'text-[#6d6d6d]',
                    tagBg: 'bg-[#404041]/10 text-[#404041] border-[#404041]/20',
                    dotColor: 'bg-[#99999a]/25'
                  };
                default:
                  return {
                    gradient: 'from-gray-100 to-gray-200',
                    title: alt || 'Mock Banner',
                    subtitle: '',
                    description: '',
                    tag: t('banners.default.tag'),
                    textColor: 'text-gray-800',
                    subColor: 'text-gray-600',
                    descColor: 'text-gray-500',
                    tagBg: 'bg-gray-200 text-gray-700 border-gray-300',
                  };
              }
            };

            const details = getBannerDetails(banner.id, banner.altText);

            return (
              <a
                key={`${banner.id}-${index}`}
                href={banner.linkUrl}
                className="min-w-full h-full relative block shrink-0 overflow-hidden"
              >
                {!banner.desktopImageUrl && !banner.mobileImageUrl ? (
                  <div className={`w-full h-full relative flex items-center justify-start bg-gradient-to-br ${details.gradient} transition-all duration-500 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden`}>
                    {/* Glowing Ambient Blobs */}
                    <div className={`absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-60 ${details.dotColor} animate-pulse`} />
                    <div className={`absolute bottom-[-10%] left-[10%] w-[35vw] h-[35vw] rounded-full blur-[90px] opacity-40 ${details.dotColor}`} />
                    
                    {/* Content Container */}
                    <div className="max-w-[1100px] w-full flex flex-col items-start text-left z-10 relative mt-[-30px] min-w-0">
                      <span className={`font-serif px-3 py-1 rounded-full text-[12px] sm:text-[13px] font-bold border backdrop-blur-md uppercase tracking-wider mb-4 sm:mb-6 ${details.tagBg}`}>
                        {details.tag}
                      </span>
                      <h1 className={`font-serif text-[38px] sm:text-[54px] md:text-[68px] lg:text-[80px] font-bold leading-[1.1] tracking-tight break-words w-full ${details.textColor}`}>
                        {details.title}
                      </h1>
                      {details.subtitle && (
                        <h2 className={`font-chulalongkorn text-[20px] sm:text-[26px] md:text-[32px] lg:text-[36px] font-semibold leading-normal tracking-wide mt-2 sm:mt-3 break-words w-full ${details.subColor}`}>
                          {details.subtitle}
                        </h2>
                      )}
                      {details.description && (
                        <p className={`font-serif text-[14px] sm:text-[16px] md:text-[18px] max-w-xl md:max-w-2xl leading-relaxed mt-4 sm:mt-5 break-words w-full ${details.descColor}`}>
                          {details.description}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <picture>
                    <source
                      media="(min-width: 768px)"
                      srcSet={banner.desktopImageUrl}
                    />
                    <img
                      src={banner.mobileImageUrl}
                      alt={banner.altText}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                )}
              </a>
            );
          })}
        </div>

        {/* Top Premium Pagination */}
        {hasMultiple && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center max-w-[90%] justify-center select-none">
            {banners.map((_, idx) => {
              const activeIndex = (displayIndex - 1 + banners.length) % banners.length;
              const isActive = idx === activeIndex;

              let widthStyle = '0%';
              let durationStyle = '0ms';

              if (isActive) {
                widthStyle = isTransitioning ? '0%' : '100%';
                durationStyle = isTransitioning ? '0ms' : `${autoPlayInterval}ms`;
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`transition-all cursor-pointer focus:outline-none rounded-full border-none p-0 ${
                    isActive
                      ? 'h-2 w-12 sm:w-16 md:w-20 bg-white/20 overflow-hidden relative'
                      : 'h-2 w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  style={{
                    transitionDuration: '800ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {isActive && (
                    <div
                      className="h-full bg-white"
                      style={{
                        width: widthStyle,
                        transitionProperty: 'width',
                        transitionDuration: durationStyle,
                        transitionTimingFunction: 'linear',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* "ชมเว็บไซต์" CTA button — centered at bottom of banner */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleScrollDown();
            }}
            className="
              group/cta relative overflow-hidden
              flex items-center gap-2
              h-[52px] px-10
              rounded-[10px]
              font-serif text-[16px] font-bold tracking-wide
              text-white border-2 border-[#E992B4]
              bg-[#E992B4]
              transition-colors duration-300
              hover:text-[#DE5D8F]
              active:scale-95 cursor-pointer
            "
            aria-label={t('banners.cta_label')}
          >
            {/* Left-to-right white fill */}
            <span
              className="
                absolute inset-0
                bg-white
                -translate-x-full
                group-hover/cta:translate-x-0
                transition-transform duration-300 ease-in-out
                z-0
              "
            />
            <span className="relative z-10 flex items-center gap-2">
              {t('banners.cta_label')}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-y-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
