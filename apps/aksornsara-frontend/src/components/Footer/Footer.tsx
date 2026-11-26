import { useTranslation } from 'react-i18next';
import { logoImg, legacyLogo } from '@artsgoz/design-system';
import { SOCIAL_LINKS } from './footerData.js';
import { FooterSocialLink } from './FooterSocialLink.js';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="w-full relative overflow-hidden bg-[#F2F2F2] select-none text-black">
      {/* Pink Radial Aura Blur Glow */}
      <div
        className="absolute -left-[380px] -bottom-[380px] w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none z-0"
        style={{
          backgroundColor: '#D23976',
          filter: 'blur(106px)',
        }}
      />

      {/* Corporate Legacy Logo Watermark Emblem */}
      <div className="absolute right-[-60px] sm:right-[-40px] bottom-[-20px] pointer-events-none select-none z-0 opacity-20 sm:opacity-30">
        <img
          src={legacyLogo}
          alt=""
          className="w-[300px] sm:w-[544px] h-[200px] sm:h-[352px] object-contain"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[1282px] mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8 flex flex-col gap-8 sm:gap-12">
        {/* Left Column: Logo + Address + Social Links (original design, links columns removed) */}
        <div className="w-full flex flex-col items-start">
          <div className="w-full max-w-[420px] flex flex-col items-start shrink-0">
            <img
              src={logoImg}
              alt="Arts GOZ Logo"
              className="w-[200px] sm:w-[240px] h-[44px] sm:h-[52px] object-contain mb-4 sm:mb-6"
            />
            <p className="font-serif text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-black mb-6 whitespace-pre-line m-0">
              {t('footer.address')}
            </p>

            {/* Desktop Social Links List (Original Design) */}
            <div className="hidden sm:flex flex-col gap-3.5 w-full">
              {SOCIAL_LINKS.map((link) => (
                <FooterSocialLink key={link.label} link={link} />
              ))}
            </div>

            {/* Mobile Social Links: Horizontal Icons Row (Original Design) */}
            <div className="flex sm:hidden items-center gap-3 w-full">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 rounded-full bg-white border border-[#E992B4]/40 flex items-center justify-center text-[#DE5D8F] hover:bg-[#DE5D8F] hover:text-white transition-all shadow-2xs"
                  aria-label={t(link.label)}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright Row (Original Design) */}
        <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif text-[13px] sm:text-[14px] text-black">
          <span className="text-center sm:text-left no-underline border-none">
            @All Right Reserved, Arts Chula Student Committee 2026
          </span>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#D23976] transition-colors no-underline text-black"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#D23976] transition-colors no-underline text-black"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
