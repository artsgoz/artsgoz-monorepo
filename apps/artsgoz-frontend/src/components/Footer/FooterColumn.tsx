import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FooterColumnData } from './footerData.js';

interface FooterColumnProps {
  column: FooterColumnData;
}

export function FooterColumn({ column }: FooterColumnProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-2">
      <h4 className="font-serif text-[20px] leading-[28px] font-bold text-[#DE5D8F] mb-1">
        {t(column.title)}
      </h4>
      {column.links.map((link) => {
        if (link.isExternal) {
          return (
            <a
              key={link.label}
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-[16px] leading-[24px] font-normal text-black hover:text-[#DE5D8F] transition-colors"
            >
              {t(link.label)}
            </a>
          );
        }
        return (
          <Link
            key={link.label}
            to={link.path}
            className="font-serif text-[16px] leading-[24px] font-normal text-black hover:text-[#DE5D8F] transition-colors"
          >
            {t(link.label)}
          </Link>
        );
      })}
    </div>
  );
}

export default FooterColumn;
