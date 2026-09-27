import React from 'react';
import { TopNavigationHeader } from '../submodules/drawer';
import { colors, type ThemeMode } from '../styles/theme';
import type { UserInfo } from './shared/UserDropdownMenu';

interface AppLayoutProps {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  activeItem?: string;
  onSelectMenuItem?: (itemId: string) => void;
  user?: UserInfo;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  themeMode = 'light',
  onToggleTheme,
  activeItem = 'dashboard',
  onSelectMenuItem,
  user,
  onLogout,
  children,
}) => {
  const currentTheme = colors[themeMode];

  return (
    <div
      className="min-h-screen flex flex-col antialiased transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.textPrimary,
      }}
    >
      {/* 1. Top Drawer / Header (App Header Navigation Bar) */}
      <TopNavigationHeader
        themeMode={themeMode}
        onToggleTheme={onToggleTheme}
        activeItem={activeItem}
        onSelectMenuItem={onSelectMenuItem}
        user={user}
        onLogout={onLogout}
      />

      {/* 2. Main App Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

