import { useTranslation } from 'react-i18next';
import { logoImg } from '@artsgoz/design-system';
import { SOCIAL_LINKS, FOOTER_COLUMNS } from './footerData.js';
import { FooterColumn } from './FooterColumn.js';
import { FooterSocialLink } from './FooterSocialLink.js';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full relative overflow-hidden bg-white border-t-[20px] border-[#E992B4] select-none">
      {/* Background Watermark Logo */}
      <img
        src={logoImg}
        alt=""
        className="absolute right-[-163px] bottom-[-55px] w-[494px] h-[292px] opacity-[0.04] pointer-events-none select-none object-contain hidden lg:block"
      />

      <div className="relative z-10 w-full max-w-[1282px] mx-auto px-4 lg:px-6 py-10 lg:pt-[44px] lg:pb-[40px] flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-[99px]">
        {/* Left Section: Branding & Socials */}
        <div className="w-full lg:w-[298px] flex flex-col items-start shrink-0">
          <img
            src={logoImg}
            alt="Artsgoz Logo"
            className="w-[263px] h-[56px] object-contain mb-8"
          />
          <p className="font-serif text-[16px] leading-[24px] text-black mb-8 whitespace-pre-line">
            {t('footer.address')}
          </p>

          {/* Social Links */}
          <div className="flex flex-col gap-[15.5px] w-full">
            {SOCIAL_LINKS.map((link) => (
              <FooterSocialLink key={link.label} link={link} />
            ))}
          </div>
        </div>

        {/* Right Section: Navigation Grid */}
        <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-10">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn key={column.title} column={column} />
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
