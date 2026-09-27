import React, { useState } from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { colors, type ThemeMode } from '../styles/theme';
import { UserDropdownMenu, type UserInfo } from './shared/UserDropdownMenu';
import logoCircular from '../assets/logo-circular.png';

export interface TopNavigationHeaderProps {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  activeItem?: string;
  onSelectMenuItem?: (itemId: string) => void;
  user?: UserInfo;
  onLogout?: () => void;
}

export interface NavItem {
  id: string;
  label: string;
}

export const TopNavigationHeader: React.FC<TopNavigationHeaderProps> = ({
  themeMode = 'light',
  onToggleTheme,
  activeItem = 'dashboard',
  onSelectMenuItem,
  user = {
    name: 'João Silva',
    email: 'joao.silva@morrogrande.com.br',
    role: 'Gerente Agrícola',
  },
  onLogout,
}) => {
  const currentTheme = colors[themeMode];
  const isDark = themeMode === 'dark';
  // State for real-time Date & Time (dd/mm/aa hh:mm:ss)
  const [currentDateTime, setCurrentDateTime] = useState<string>(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setCurrentDateTime(`${dd}/${mm}/${yy} ${hh}:${min}:${ss}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Top Drawer Navigation Tabs matching the app's key sections
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Visão Geral' },
    { id: 'collaborators', label: 'Ordens de Serviço' },
    { id: 'clients', label: 'Maquinários' },
    { id: 'history', label: 'Clientes' },
    { id: 'calendar', label: 'Financeiro' },
  ];

  const handleNavClick = (itemId: string) => {
    if (onSelectMenuItem) {
      onSelectMenuItem(itemId);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b transition-colors shadow-2xs backdrop-blur-md"
      style={{
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: currentTheme.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* 1. Lado Esquerdo: Logo Morro Grande + Divisor Vertical | */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="h-10 w-10 rounded-full border border-emerald-900/10 bg-white p-0.5 shadow-xs overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={logoCircular}
                alt="Fazenda Morro Grande Agronegócios"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-sm font-bold tracking-tight"
                style={{ color: currentTheme.textPrimary }}
              >
                Morro Grande
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#2d7044] mt-0.5">
                Agronegócios
              </span>
            </div>
          </div>

          {/* Separador Vertical */}
          <div
            className="h-6 w-px mx-1.5 hidden sm:block"
            style={{ backgroundColor: currentTheme.border }}
          />
        </div>

        {/* 2. Centro: Drawer Top Navigation Tabs (Navegação Horizontal no Topo) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isDark
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-900 shadow-2xs'
                    : isDark
                    ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 3. Lado Direito: Data/Hora Real + Notificação + Tema + User Profile Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Tag Data e Hora Real: dd/mm/aa hh:mm:ss */}
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium shadow-2xs"
            style={{
              backgroundColor: isDark ? 'rgba(17, 24, 39, 0.6)' : 'rgba(249, 250, 251, 0.8)',
              borderColor: currentTheme.border,
              color: currentTheme.textSecondary,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold tracking-tight" style={{ color: currentTheme.textPrimary }}>
              {currentDateTime}
            </span>
            <span>•</span>
            <span className="text-[11px] font-sans opacity-80">Tempo Real</span>
          </div>

          {/* Botão de Notificação */}
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 border-2 border-white dark:border-neutral-900 rounded-full" />
          </button>

          {/* Toggle de Tema */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              title="Alternar Tema"
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300"
            >
              {themeMode === 'light' ? (
                <Moon className="w-4 h-4 text-neutral-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          {/* Botão de Perfil do Usuário (Aciona o UserDropdownMenu) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center justify-center w-9 h-9 rounded-full border font-bold text-xs transition-all cursor-pointer shadow-xs ${
                isDropdownOpen
                  ? 'ring-2 ring-[#2d7044]/40 border-[#2d7044]'
                  : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: isDark ? '#111827' : '#F3F4F6',
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary,
              }}
              title="Menu do Usuário"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-[#2d7044] dark:text-emerald-400">
                  {getInitials(user.name || 'MG')}
                </span>
              )}
            </button>

            {/* Menu Suspenso Modular Compartilhado */}
            <UserDropdownMenu
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              user={user}
              themeMode={themeMode}
              onProfileClick={() => onSelectMenuItem?.('profile')}
              onSettingsClick={() => onSelectMenuItem?.('settings')}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Items (Dropdown em telas pequenas) */}
      <div className="md:hidden border-t px-4 py-2 flex items-center justify-around overflow-x-auto" style={{ borderColor: currentTheme.border }}>
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#2d7044] text-white'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
