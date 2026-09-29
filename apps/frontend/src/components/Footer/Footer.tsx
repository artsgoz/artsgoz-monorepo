import { useTranslation } from 'react-i18next';
import { logoImg, legacyLogo } from '@org/design-system';
import { SOCIAL_LINKS, FOOTER_COLUMN_GROUPS } from './footerData.js';
import { FooterColumn } from './FooterColumn.js';
import { FooterSocialLink } from './FooterSocialLink.js';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="w-full relative overflow-hidden bg-[#F2F2F2] select-none text-black">
      {/* Pink Radial Aura Blur Glow (Figma Node #7692:35384 - bottom left with ~20% visible) */}
      <div
        className="absolute -left-[380px] -bottom-[380px] w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none z-0"
        style={{
          backgroundColor: '#D23976',
          filter: 'blur(106px)',
        }}
      />

      {/* Corporate Legacy Logo Watermark Emblem (Figma Node #7692:35509 - bottom right) */}
      <div className="absolute right-[-40px] bottom-[-20px] pointer-events-none select-none z-0 opacity-30 hidden lg:block">
        <img
          src={legacyLogo}
          alt=""
          className="w-[544px] h-[352px] object-contain"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[1282px] mx-auto px-6 pt-12 pb-8 flex flex-col gap-12">
        {/* Top Grid Row: Left Branding/Socials + Right 3-Column Navigation Grid */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
          {/* Left Column: Logo + Address + Social Links */}
          <div className="w-full lg:w-[320px] flex flex-col items-start shrink-0">
            <img
              src={logoImg}
              alt="Arts GOZ Logo"
              className="w-[240px] h-[52px] object-contain mb-6"
            />
            <p className="font-serif text-[16px] leading-[24px] text-black mb-6 whitespace-pre-line">
              {t('footer.address')}
            </p>

            {/* Social Links List */}
            <div className="flex flex-col gap-3.5 w-full">
              {SOCIAL_LINKS.map((link) => (
                <FooterSocialLink key={link.label} link={link} />
              ))}
            </div>
          </div>

          {/* Right Navigation Column Groups */}
          <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 pt-2">
            {FOOTER_COLUMN_GROUPS.map((group, idx) => (
              <FooterColumn key={idx} group={group} />
            ))}
          </div>
        </div>

        {/* Bottom Bar & Copyright Row (Line over copyright text removed) */}
        <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-serif text-[14px] text-black">
          <span className="text-center sm:text-left no-underline border-none">
            @All Right Reserved,Arts Chula Student Committee 2026
          </span>
          <div className="flex items-center gap-6">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#D23976] transition-colors no-underline">
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#D23976] transition-colors no-underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
