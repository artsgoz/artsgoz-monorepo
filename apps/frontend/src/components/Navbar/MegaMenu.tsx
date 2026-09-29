import { Link } from 'react-router';

export interface MegaMenuCategory {
  /** Display label for the category tab */
  label: string;
  /** Links to show in this category's column */
  items: MegaMenuItem[];
}

export interface MegaMenuItem {
  label: string;
  path: string;
}

interface MegaMenuProps {
  categories: MegaMenuCategory[];
  onClose: () => void;
}

const FONT_FAMILY = 'ChulaCharasNew, sans-serif';

export function MegaMenu({ categories, onClose }: MegaMenuProps) {
  return (
    <div
      className="fixed left-0 right-0 bg-[#F2F2F2] z-40 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
      style={{ top: '81px' }}
    >
      {/* Inner container — max-width matches the rest of the site */}
      <div className="max-w-[1282px] mx-auto px-[50px] pt-8 pb-14">
        {/* Category tabs row */}
        <div className="flex items-center gap-[73px] mb-8 border-b border-gray-200 pb-6">
          {categories.map((cat) => (
            <span
              key={cat.label}
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '28px',
                color: '#000000',
              }}
            >
              {cat.label}
            </span>
          ))}
        </div>

        {/* Link columns — one per category */}
        <div className="flex gap-[71px]">
          {categories.map((cat) => (
            <div key={cat.label} className="flex flex-col gap-[14px]">
              {cat.items.map((item) => (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  onClick={onClose}
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '28px',
                    color: '#000000',
                    textDecoration: 'none',
                  }}
                  className="hover:!text-[#D23976] transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
