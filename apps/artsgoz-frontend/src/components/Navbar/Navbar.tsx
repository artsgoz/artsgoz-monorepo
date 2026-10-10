import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  logoImg,
  MobileStudentProfileCard,
  MobileManageAccountCard,
} from '@artsgoz/design-system';
import { PATHS } from '../../routes/paths.js';
import { DesktopMenu } from './DesktopMenu.js';
import { NavActions } from './NavActions.js';
import { MobileMenuPanel, MobileMenuToggle } from './MobileMenu.js';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // TODO: ในอนาคตเมื่อเชื่อมต่อฐานข้อมูล ให้เปลี่ยนไปดึงและเก็บข้อมูลโปรไฟล์ผู้ใช้จริงผ่าน API/AuthContext
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [mobileProfileView, setMobileProfileView] = useState<
    'profile' | 'manage'
  >('profile');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;
      let scrollTopValue = 0;
      if (target === document) {
        scrollTopValue = window.scrollY || document.documentElement.scrollTop;
      } else if (target instanceof HTMLElement) {
        scrollTopValue = target.scrollTop;
      }
      setIsScrolled(scrollTopValue > 20);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleLogin = () => {
    // TODO: เชื่อมต่อ API ล็อกอินจริง (เช่น นำ Token ที่ได้รับหลังการตรวจสอบผ่าน SSO ไปเช็คกับระบบฐานข้อมูล)
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // TODO: เชื่อมต่อ API ออกจากระบบจริงเพื่อล้างเซสชันฝั่งหลังบ้าน (และเคลียร์ Token ฝั่งผู้ใช้)
    setIsLoggedIn(false);
    setIsMobileProfileOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-transparent transition-all duration-300">
      {/* Background layer: transparent at top, white glassmorphism when scrolled */}
      <div
        className={`absolute inset-0 bg-white transition-all duration-300 ease-in-out z-0 ${
          isScrolled
            ? 'bg-opacity-80 backdrop-blur-md shadow-[0_2px_10px_0_rgba(0,0,0,0.05)] border-b border-gray-150/70'
            : 'bg-opacity-0 shadow-none border-b border-transparent'
        }`}
      />

      <div className="relative z-10 flex items-center justify-between lg:justify-end w-full h-[65px] lg:h-[81px] px-4 lg:px-6 gap-4 lg:gap-[38px]">
        <Link
          to={PATHS.ROOT}
          className="shrink-0 flex items-center hover:opacity-90 transition-opacity lg:mr-auto"
        >
          <img
            src={logoImg}
            alt="Artsgoz Logo"
            className="w-[130px] lg:w-[174px] aspect-[174/37] object-contain transition-all"
          />
        </Link>

        <div className="hidden lg:block transition-all duration-300">
          <DesktopMenu />
        </div>

        <div className="hidden sm:block transition-all duration-300">
          <div className="flex items-center gap-4 lg:gap-[38px]">
            <NavActions
              isLoggedIn={isLoggedIn}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>
        </div>

        <div className="lg:hidden transition-all duration-300">
          <MobileMenuToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      <MobileMenuPanel
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAccountClick={() => {
          setIsMobileProfileOpen(true);
          setMobileProfileView('profile');
        }}
      />

      {isMobileProfileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setIsMobileProfileOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {mobileProfileView === 'profile' ? (
              <MobileStudentProfileCard
                onClose={() => setIsMobileProfileOpen(false)}
                onManageClick={() => setMobileProfileView('manage')}
                onLogout={handleLogout}
              />
            ) : (
              <MobileManageAccountCard
                onBack={() => setMobileProfileView('profile')}
                onEditClick={() => console.log('Mobile: Edit profile clicked')}
                onAvatarUpload={() =>
                  console.log('Mobile: Avatar upload clicked')
                }
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
