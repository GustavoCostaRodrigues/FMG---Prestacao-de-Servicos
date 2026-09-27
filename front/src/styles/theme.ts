export interface BadgeTheme {
    bg: string;
    text: string;
    border: string;
}

export interface ThemeTokens {
    background: string;
    surface: string;
    surfaceSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    primaryHover: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    
    badgeSuccess: BadgeTheme;
    badgeWarning: BadgeTheme;
    badgeInfo: BadgeTheme;
    badgeDanger: BadgeTheme;
    badgeNeutral: BadgeTheme;
    
    iconBoxSuccess: BadgeTheme;
    iconBoxWarning: BadgeTheme;
    iconBoxInfo: BadgeTheme;
    iconBoxDanger: BadgeTheme;

    cardHoverBg: string;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    dropdownBg: string;
    dropdownHover: string;
}

export const colors: Record<'light' | 'dark', ThemeTokens> = {
    light: {
        background: '#F4F5F7',
        surface: '#FFFFFF',
        surfaceSecondary: '#F8FAFC',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        textMuted: '#64748B',
        primary: '#2d7044',
        primaryHover: '#235a35',
        border: '#E2E8F0',
        error: '#EF4444',
        success: '#16A34A',
        warning: '#F59E0B',
        info: '#3B82F6',
        
        badgeSuccess: {
            bg: '#DCFCE7',
            text: '#15803D',
            border: '#86EFAC',
        },
        badgeWarning: {
            bg: '#FEF3C7',
            text: '#B45309',
            border: '#FDE68A',
        },
        badgeInfo: {
            bg: '#DBEAFE',
            text: '#1D4ED8',
            border: '#93C5FD',
        },
        badgeDanger: {
            bg: '#FFE4E6',
            text: '#BE123C',
            border: '#FECDD3',
        },
        badgeNeutral: {
            bg: '#F1F5F9',
            text: '#334155',
            border: '#CBD5E1',
        },
        
        iconBoxSuccess: {
            bg: '#DCFCE7',
            text: '#15803D',
            border: '#86EFAC',
        },
        iconBoxWarning: {
            bg: '#FEF3C7',
            text: '#B45309',
            border: '#FDE68A',
        },
        iconBoxInfo: {
            bg: '#DBEAFE',
            text: '#1D4ED8',
            border: '#93C5FD',
        },
        iconBoxDanger: {
            bg: '#FFE4E6',
            text: '#BE123C',
            border: '#FECDD3',
        },

        cardHoverBg: '#F8FAFC',
        inputBg: '#FFFFFF',
        inputBorder: '#CBD5E1',
        inputText: '#0F172A',
        dropdownBg: '#FFFFFF',
        dropdownHover: '#F1F5F9',
    },
    dark: {
        background: '#111827',
        surface: '#1F2937',
        surfaceSecondary: '#111827',
        textPrimary: '#F9FAFB',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        primary: '#2d7044',
        primaryHover: '#235a35',
        border: '#374151',
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#3B82F6',
        
        badgeSuccess: {
            bg: 'rgba(6, 78, 59, 0.6)',
            text: '#34D399',
            border: 'rgba(6, 95, 70, 0.4)',
        },
        badgeWarning: {
            bg: 'rgba(120, 53, 15, 0.6)',
            text: '#FBBF24',
            border: 'rgba(146, 64, 14, 0.4)',
        },
        badgeInfo: {
            bg: 'rgba(30, 58, 138, 0.6)',
            text: '#60A5FA',
            border: 'rgba(30, 64, 175, 0.4)',
        },
        badgeDanger: {
            bg: 'rgba(136, 19, 55, 0.6)',
            text: '#F87171',
            border: 'rgba(159, 18, 57, 0.4)',
        },
        badgeNeutral: {
            bg: '#374151',
            text: '#D1D5DB',
            border: '#4B5563',
        },
        
        iconBoxSuccess: {
            bg: 'rgba(6, 78, 59, 0.5)',
            text: '#34D399',
            border: 'rgba(6, 95, 70, 0.3)',
        },
        iconBoxWarning: {
            bg: 'rgba(120, 53, 15, 0.5)',
            text: '#FBBF24',
            border: 'rgba(146, 64, 14, 0.3)',
        },
        iconBoxInfo: {
            bg: 'rgba(30, 58, 138, 0.5)',
            text: '#60A5FA',
            border: 'rgba(30, 64, 175, 0.3)',
        },
        iconBoxDanger: {
            bg: 'rgba(136, 19, 55, 0.5)',
            text: '#F87171',
            border: 'rgba(159, 18, 57, 0.3)',
        },

        cardHoverBg: '#374151',
        inputBg: '#111827',
        inputBorder: '#374151',
        inputText: '#F9FAFB',
        dropdownBg: '#1F2937',
        dropdownHover: '#374151',
    }
};

export type ThemeMode = 'light' | 'dark';