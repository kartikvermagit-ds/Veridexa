import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, MobileNavDrawer, MobileBottomNav } from './Sidebar';
import { Topbar } from './Topbar';

export const AppLayout: React.FC = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-industrial-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Slide-in Drawer */}
      <MobileNavDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar with mobile hamburger trigger */}
        <Topbar onOpenMobileMenu={() => setIsMobileDrawerOpen(true)} />

        {/* Main Content Area: padded at bottom on mobile to accommodate bottom nav bar */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Phone Bottom Tab Bar */}
      <MobileBottomNav />
    </div>
  );
};
