import React, { useEffect, useRef } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { colors, type ThemeMode } from '../../styles/theme';

export interface UserInfo {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
}

export interface UserDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserInfo;
  themeMode?: ThemeMode;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  isOpen,
  onClose,
  user = {
    name: 'João Silva',
    email: 'joao.silva@morrogrande.com.br',
    role: 'Gerente Agrícola',
  },
  themeMode = 'light',
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const currentTheme = colors[themeMode];
  const isDark = themeMode === 'dark';

  // Listen for Click Outside & Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (callback?: () => void) => {
    onClose();
    if (callback) {
      callback();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-xl py-2 z-50 transition-all duration-200 ease-out origin-top-right animate-in fade-in zoom-in-95"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.border,
        color: currentTheme.textPrimary,
      }}
    >
      {/* Dynamic Header Section with Logged User Information */}
      <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: currentTheme.border }}>
        <div className="relative shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-emerald-600/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#2d7044] text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {getInitials(user.name || 'JS')}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold tracking-tight truncate" style={{ color: currentTheme.textPrimary }}>
            {user.name}
          </span>
          <span className="text-xs truncate opacity-70" style={{ color: currentTheme.textSecondary }}>
            {user.email || 'joao.silva@morrogrande.com.br'}
          </span>
          {user.role && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#2d7044] mt-0.5">
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Menu Options: Perfil, Ajustes, Sair */}
      <div className="py-1">
        {/* 1. Meu Perfil */}
        <button
          type="button"
          onClick={() => handleAction(onProfileClick)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
            isDark ? 'hover:bg-neutral-800/80 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          <User className="w-4 h-4 text-[#2d7044] shrink-0" />
          <span>Meu Perfil</span>
        </button>

        {/* 2. Ajustes */}
        <button
          type="button"
          onClick={() => handleAction(onSettingsClick)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
            isDark ? 'hover:bg-neutral-800/80 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          <Settings className="w-4 h-4 text-[#2d7044] shrink-0" />
          <span>Ajustes</span>
        </button>
      </div>

      <div className="my-1 border-t" style={{ borderColor: currentTheme.border }} />

      {/* 3. Sair */}
      <div className="py-0.5">
        <button
          type="button"
          onClick={() => handleAction(onLogout)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};
