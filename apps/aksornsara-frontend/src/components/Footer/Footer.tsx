import { useTranslation } from 'react-i18next';
import { logoImg, legacyLogo } from '@artsgoz/design-system';
import { SOCIAL_LINKS } from './footerData.js';

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
      <div className="relative z-10 w-full max-w-[1282px] mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8 flex flex-col gap-8 sm:gap-10">
        {/* Top Section: Left Branding & Social Links (F-NAV-008: keep only functional left part) */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-300/60 pb-8">
          {/* Logo + Address */}
          <div className="w-full max-w-[560px] flex flex-col items-start">
            <img
              src={logoImg}
              alt="Arts GOZ Logo"
              className="w-[200px] sm:w-[240px] h-[44px] sm:h-[52px] object-contain mb-4"
            />
            <p className="font-serif text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-black whitespace-pre-line m-0">
              {t('footer.address')}
            </p>
          </div>

          {/* Social Links List */}
          <div className="flex flex-col gap-3 shrink-0">
            <span className="font-serif text-[15px] font-bold text-[#D23976]">ช่องทางการติดต่อ</span>
            <div className="flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E992B4]/40 text-[#DE5D8F] hover:bg-[#DE5D8F] hover:text-white transition-all shadow-2xs text-[14px] font-serif no-underline"
                  title={t(link.label)}
                >
                  {link.icon}
                  <span className="text-black hover:text-inherit font-bold">{t(link.label)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright Row */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-serif text-[13px] sm:text-[14px] text-black">
          <span className="text-center sm:text-left no-underline border-none">
            @All Right Reserved, Arts Chula Student Committee 2026
          </span>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-gray-600">ชมรมอักษรสาราณียกร คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
