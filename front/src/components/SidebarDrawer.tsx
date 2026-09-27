import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  History,
  Calendar,
  X,
} from 'lucide-react';
import { colors, type ThemeMode } from '../styles/theme';
import logoCircular from '../assets/logo-circular.png';

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface SidebarDrawerProps {
  themeMode?: ThemeMode;
  activeItem?: string;
  onSelectMenuItem?: (itemId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  themeMode = 'light',
  activeItem = 'dashboard',
  onSelectMenuItem,
  isOpen = false,
  onClose,
}) => {
  const currentTheme = colors[themeMode];
  const isDark = themeMode === 'dark';

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'collaborators', label: 'Colaboradores', icon: Users },
    { id: 'clients', label: 'Clientes', icon: UserCheck },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
  ];

  const handleNavClick = (itemId: string) => {
    if (onSelectMenuItem) {
      onSelectMenuItem(itemId);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 h-screen flex flex-col justify-between border-r transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
          color: currentTheme.textPrimary,
        }}
      >
        {/* Top Scrollable Content Container */}
        <div className="flex-1 flex flex-col overflow-y-auto px-5 py-5 gap-6">
          {/* 1. Logo da Empresa */}
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.border }}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center shadow-sm border border-emerald-900/10 bg-white p-0.5 shrink-0">
                <img
                  src={logoCircular}
                  alt="Fazenda Morro Grande Agronegócios"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[15px] font-bold tracking-tight leading-tight"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Fazenda Morro Grande
                </span>
                <span className="text-[11px] font-medium tracking-wide uppercase" style={{ color: currentTheme.textSecondary }}>
                  Agronegócios
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                style={{ color: currentTheme.textSecondary }}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 2. Botões de Navegação Principal */}
          <nav className="flex flex-col gap-1.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider px-3 mb-1"
              style={{ color: currentTheme.textSecondary }}
            >
              Menu Principal
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#2d7044] text-white shadow-sm font-semibold'
                      : isDark
                      ? 'text-[#9CA3AF] hover:bg-[#374151]/50 hover:text-[#F9FAFB]'
                      : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
