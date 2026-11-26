import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, X, BookOpen, Bookmark, User } from 'lucide-react';
import { MobileSidebar } from '@artsgoz/design-system';
import { NAV_ITEMS } from './navConfig.js';
import { LanguageSwitcher } from '../LanguageSwitcher/index.js';
import { PATHS } from '../../routes/paths.js';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuToggle({ isOpen, onClick }: MobileMenuToggleProps) {
  return (
    <button
      type="button"
      className="lg:hidden p-2 text-[#404041] hover:text-[#DE5D8F] hover:bg-[#FCEFF4]/60 active:scale-95 transition-all border-none bg-transparent cursor-pointer w-[44px] h-[44px] flex items-center justify-center rounded-[8px] shrink-0"
      onClick={onClick}
      aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
      title={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
    >
      {isOpen ? (
        <X size={28} className="text-[#404041] shrink-0" strokeWidth={2.2} />
      ) : (
        <Menu size={28} className="text-[#404041] shrink-0" strokeWidth={2.2} />
      )}
    </button>
  );
}

interface MobileMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onAccountClick?: () => void;
}

export function MobileMenuPanel({
  isOpen,
  onClose,
  isLoggedIn,
  onLogin,
  onLogout,
  onAccountClick,
}: MobileMenuPanelProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('common');

  const isActive = (path: string) => {
    const isItemSaved = path.includes('tab=saved');
    const searchParams = new URLSearchParams(location.search);
    const currentIsSaved = searchParams.get('tab') === 'saved';

    if (isItemSaved) {
      return currentIsSaved;
    }

    return (
      !currentIsSaved &&
      (location.pathname === PATHS.ROOT || location.pathname.startsWith(PATHS.ARTICLES))
    );
  };

  // Map icons based on nav item path
  const getIconByPath = (path: string) => {
    if (path.includes('tab=saved')) {
      return <Bookmark size={20} className="text-gray-400 shrink-0" />;
    }
    if (path === '#') {
      return <User size={20} className="text-gray-400 shrink-0" />;
    }
    return <BookOpen size={20} className="text-gray-400 shrink-0" />;
  };

  // Generate dynamic items based on login status
  const currentMenuItems = [...NAV_ITEMS];
  if (isLoggedIn) {
    currentMenuItems.push({ label: 'navbar.account', path: '#' });
  }

  const mappedMenuItems = currentMenuItems.map((item) => ({
    label: t(item.label),
    active: isActive(item.path),
    icon: getIconByPath(item.path),
    onClick: () => {
      if (item.label === 'navbar.account' && onAccountClick) {
        onAccountClick();
      } else {
        navigate(item.path);
      }
      onClose();
    },
  }));

  return (
    <>
      <MobileSidebar
        isOpen={isOpen}
        onClose={onClose}
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
        menuItems={mappedMenuItems}
      />
      {/* Language switcher within mobile panel — rendered below menu items */}
      {isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
          <LanguageSwitcher compact />
        </div>
      )}
    </>
  );
}
