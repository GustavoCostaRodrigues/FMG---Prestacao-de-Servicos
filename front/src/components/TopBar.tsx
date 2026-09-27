import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { colors, type ThemeMode } from '../styles/theme';
import type { UserProfile } from './SidebarDrawer';

export interface TopBarProps {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  activeItem?: string;
  onSelectMenuItem?: (itemId: string) => void;
  user?: UserProfile;
  onLogout?: () => void;
  onOpenMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  themeMode = 'light',
  onToggleTheme,
  activeItem = 'dashboard',
  onSelectMenuItem,
  user = {
    name: 'João Silva',
    role: 'Gerente Agrícola',
  },
  onLogout,
  onOpenMobileMenu,
}) => {
  const currentTheme = colors[themeMode];
  const isDark = themeMode === 'dark';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstName = user.name ? user.name.split(' ')[0] : 'Usuário';

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    if (onSelectMenuItem) {
      onSelectMenuItem('profile');
    }
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    if (onSelectMenuItem) {
      onSelectMenuItem('settings');
    }
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const titleMap: Record<string, string> = {
    dashboard: 'Dashboard',
    collaborators: 'Colaboradores',
    clients: 'Clientes',
    history: 'Histórico',
    calendar: 'Agenda',
    profile: 'Meu Perfil',
    settings: 'Configurações',
  };

  const currentTitle = titleMap[activeItem] || 'Dashboard';

  return (
    <header
      className="h-16 px-6 border-b flex items-center justify-between sticky top-0 z-30 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: `${currentTheme.surface}EE`,
        borderColor: currentTheme.border,
      }}
    >
      {/* Canto Esquerdo: Título da Tela + Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
            style={{ color: currentTheme.textPrimary }}
            aria-label="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2
          className="text-[17px] font-semibold tracking-tight"
          style={{ color: currentTheme.textPrimary }}
        >
          {currentTitle}
        </h2>
      </div>

      {/* Canto Direito: Card de Usuário (com dropdown), Engrenagem, Logoff & Tema */}
      <div className="flex items-center gap-3">
        {/* Toggle do Tema (Claro / Escuro) */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            title="Alternar Tema"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all shadow-2xs cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
              color: currentTheme.textPrimary,
            }}
          >
            {themeMode === 'light' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Modo Escuro</span>
              </>
            )}
          </button>
        )}

        {/* Card do Usuário (Foto, Primeiro Nome, Cargo) + Menu Suspenso */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs ${
              isDropdownOpen
                ? 'ring-2 ring-[#2d7044]/30'
                : isDark
                ? 'hover:bg-[#374151]/50'
                : 'hover:bg-[#F3F4F6]'
            }`}
            style={{
              backgroundColor: isDark ? '#111827' : '#F9FAFB',
              borderColor: currentTheme.border,
            }}
          >
            {/* Foto / Avatar do Usuário */}
            <div className="relative shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-600/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#2d7044] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'JS'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Primeiro Nome e Cargo */}
            <div className="hidden sm:flex flex-col text-left">
              <span
                className="text-[13px] font-semibold tracking-tight leading-none"
                style={{ color: currentTheme.textPrimary }}
              >
                {firstName}
              </span>
              <span
                className="text-[11px] font-normal leading-tight mt-0.5"
                style={{ color: currentTheme.textSecondary }}
              >
                {user.role}
              </span>
            </div>

            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              style={{ color: currentTheme.textSecondary }}
            />
          </button>

          {/* Menu Suspenso ao clicar no Card do Usuário */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl border shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary,
              }}
            >
              <button
                type="button"
                onClick={handleProfileClick}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'
                }`}
              >
                <User className="w-4 h-4 text-[#2d7044]" />
                <span>Meu Perfil</span>
              </button>

              <button
                type="button"
                onClick={handleSettingsClick}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-[#374151]' : 'hover:bg-[#F3F4F6]'
                }`}
              >
                <Settings className="w-4 h-4 text-[#2d7044]" />
                <span>Configurações</span>
              </button>

              <div
                className="my-1 border-t"
                style={{ borderColor: currentTheme.border }}
              />

              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>

        {/* Ícone de Engrenagem (Configurações) */}
        <button
          type="button"
          onClick={handleSettingsClick}
          title="Configurações"
          className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
            activeItem === 'settings'
              ? 'bg-[#2d7044] text-white border-[#2d7044]'
              : isDark
              ? 'hover:bg-[#374151]/50'
              : 'hover:bg-[#F3F4F6]'
          }`}
          style={{
            backgroundColor: activeItem === 'settings' ? '#2d7044' : currentTheme.surface,
            borderColor: activeItem === 'settings' ? '#2d7044' : currentTheme.border,
            color: activeItem === 'settings' ? '#FFFFFF' : currentTheme.textSecondary,
          }}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Ícone de Logoff (Sair) */}
        <button
          type="button"
          onClick={handleLogoutClick}
          title="Sair"
          className="p-2 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer shadow-2xs"
          style={{
            backgroundColor: currentTheme.surface,
          }}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
