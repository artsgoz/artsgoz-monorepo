import { LoginPanel, useAuth, logout } from '@base-components';
import { useState } from 'react';
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
  const { profile } = useAuth();
  const isLoggedIn = !!profile;
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [mobileProfileView, setMobileProfileView] = useState<
    'profile' | 'manage'
  >('profile');

  const handleLogin = () => {
    setIsLoginOpen(true);
    setIsMobileMenuOpen(false);
  };
  const handleLogout = () => {
    void logout();
    setIsMobileProfileOpen(false);
  };

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-white border-b border-[#E5E5E5] shadow-[0px_2px_4px_rgba(0,0,0,0.06)]">
        <div className="relative flex items-center justify-between lg:justify-start w-full max-w-[1282px] mx-auto h-[65px] lg:h-[81px] px-4 lg:px-[24px] gap-4">
          {/* Logo — left side */}
          <Link
            to={PATHS.ROOT}
            className="shrink-0 flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src={logoImg}
              alt="Artsgoz Logo"
              className="w-[130px] lg:w-[174px] aspect-[174/37] object-contain"
            />
          </Link>

          {/* Desktop menu — centred between logo and right actions */}
          <div className="hidden lg:flex flex-1 justify-center h-full">
            <DesktopMenu />
          </div>

          {/* Right actions: search + lang + login */}
          <div className="hidden sm:flex items-center gap-3 lg:gap-4 xl:gap-6 shrink-0 lg:ml-auto">
            <NavActions
              isLoggedIn={isLoggedIn}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden ml-auto">
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
                  studentName={profile?.username || profile?.email}
                  avatarUrl={profile?.avatar_url}
                  studentId=""
                  major=""
                  minor=""
                  onClose={() => setIsMobileProfileOpen(false)}
                  onManageClick={() => setMobileProfileView('manage')}
                  onLogout={handleLogout}
                />
              ) : (
                <MobileManageAccountCard
                  onBack={() => setMobileProfileView('profile')}
                  onEditClick={() =>
                    console.log('Mobile: Edit profile clicked')
                  }
                  onAvatarUpload={() =>
                    console.log('Mobile: Avatar upload clicked')
                  }
                />
              )}
            </div>
          </div>
        )}
      </nav>
      {isLoginOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Sign in to Artsgoz"
        >
          <LoginPanel onClose={() => setIsLoginOpen(false)} />
        </div>
      )}
    </>
  );
}
