import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/Navbar/index.js';
import { ScrollToTopButton } from '../components/ScrollToTopButton/index.js';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on every route change (F-DTL-002, F-NAV-003)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      {/* Spacer to prevent page content from being pushed under the fixed navbar */}
      <div className="h-[65px] lg:h-[81px] shrink-0" />

      <main className="flex-1">
        <Outlet />
      </main>

      <ScrollToTopButton />
    </div>
  );
}

