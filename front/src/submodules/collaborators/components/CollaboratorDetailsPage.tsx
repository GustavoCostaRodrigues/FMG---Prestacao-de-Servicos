import React from 'react';
import {
    ArrowLeft, Phone, Mail, MessageSquare, Pencil,
    ShieldCheck, FileText, CheckCircle2,
    User, Award
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import type { Collaborator } from './CollaboratorsPage';

export interface CollaboratorDetailsPageProps {
    collaborator: Collaborator;
    themeMode?: ThemeMode;
    onBack: () => void;
    onEdit?: (collaborator: Collaborator) => void;
}

export const CollaboratorDetailsPage: React.FC<CollaboratorDetailsPageProps> = ({
    collaborator,
    themeMode = 'dark',
    onBack,
    onEdit,
}) => {
    const currentTheme = colors[themeMode || 'dark'];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const cleanPhone = collaborator.phone.replace(/\D/g, '');

    const statusStyle =
        collaborator.status === 'active_field'
            ? currentTheme.badgeSuccess
            : collaborator.status === 'active_base'
            ? currentTheme.badgeInfo
            : collaborator.status === 'vacation'
            ? currentTheme.badgeWarning
            : currentTheme.badgeNeutral;

    return (
        <div className="space-y-6 animate-in fade-in duration-300 font-inter">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                    style={{
                        backgroundColor: currentTheme.surface,
                        borderColor: currentTheme.border,
                        color: currentTheme.textPrimary,
                    }}
                >
                    <ArrowLeft className="w-4 h-4" style={{ color: currentTheme.textSecondary }} />
                    <span>Voltar para Lista de Colaboradores</span>
                </button>

                <div className="flex items-center gap-2">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(collaborator)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Editar Colaborador</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Header Banner Card */}
            <div
                className="p-6 rounded-2xl border shadow-sm space-y-6 transition-colors relative overflow-hidden"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-20 h-20 rounded-2xl ${collaborator.avatarBg} text-white font-bold text-2xl flex items-center justify-center shadow-md border-2 shrink-0 font-mono-code`}
                            style={{ borderColor: currentTheme.border }}
                        >
                            {getInitials(collaborator.name)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                                    {collaborator.name}
                                </h1>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold border font-mono-code"
                                    style={{
                                        backgroundColor: currentTheme.badgeSuccess.bg,
                                        color: currentTheme.badgeSuccess.text,
                                        borderColor: currentTheme.badgeSuccess.border,
                                    }}
                                >
                                    {collaborator.id}
                                </span>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold border"
                                    style={{
                                        backgroundColor: statusStyle.bg,
                                        color: statusStyle.text,
                                        borderColor: statusStyle.border,
                                    }}
                                >
                                    ● {collaborator.statusLabel}
                                </span>
                            </div>

                            <p className="text-xs mt-1 font-medium" style={{ color: currentTheme.textSecondary }}>
                                {collaborator.role} • Alocado em: <strong style={{ color: currentTheme.primary }}>{collaborator.location}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Quick Contact CTA Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <a
                            href={`tel:${cleanPhone}`}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all"
                            style={{
                                backgroundColor: currentTheme.surfaceSecondary,
                                borderColor: currentTheme.border,
                                color: currentTheme.textPrimary,
                            }}
                        >
                            <Phone className="w-4 h-4" style={{ color: currentTheme.primary }} />
                            <span>Ligar ({collaborator.phone})</span>
                        </a>

                        <a
                            href={`https://wa.me/55${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-2xs"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>WhatsApp</span>
                        </a>

                        <a
                            href={`mailto:${collaborator.email}`}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all"
                            style={{
                                backgroundColor: currentTheme.surfaceSecondary,
                                borderColor: currentTheme.border,
                                color: currentTheme.badgeInfo.text,
                            }}
                        >
                            <Mail className="w-4 h-4" style={{ color: currentTheme.badgeInfo.text }} />
                            <span>E-mail</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* 4-KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="p-4 rounded-2xl border space-y-1"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                >
                    <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: currentTheme.textSecondary }}>
                        O.S. Ativas em Campo
                    </span>
                    <span className="text-2xl font-bold font-jakarta block font-mono-code" style={{ color: currentTheme.badgeSuccess.text }}>
                        {collaborator.activeOS} Ordens
                    </span>
                    <span className="text-[10px] block" style={{ color: currentTheme.textMuted }}>Operação em andamento</span>
                </div>

                <div
                    className="p-4 rounded-2xl border space-y-1"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                >
                    <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: currentTheme.textSecondary }}>
                        Equipamento Vinculado
                    </span>
                    <span className="text-sm font-bold font-jakarta block truncate" style={{ color: currentTheme.textPrimary }}>
                        {collaborator.linkedMachine || 'Nenhum Alocado'}
                    </span>
                    <span className="text-[10px] block font-mono-code" style={{ color: currentTheme.badgeSuccess.text }}>Telemetria CAN-Bus Ativa</span>
                </div>

                <div
                    className="p-4 rounded-2xl border space-y-1"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                >
                    <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: currentTheme.textSecondary }}>
                        Horas Apontadas (Mês)
                    </span>
                    <span className="text-2xl font-bold font-jakarta block font-mono-code" style={{ color: currentTheme.badgeInfo.text }}>
                        148.5h
                    </span>
                    <span className="text-[10px] block" style={{ color: currentTheme.textMuted }}>100% de presença</span>
                </div>

                <div
                    className="p-4 rounded-2xl border space-y-1"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                >
                    <span className="text-xs font-semibold uppercase tracking-wider block" style={{ color: currentTheme.textSecondary }}>
                        Certificação & CNH
                    </span>
                    <span className="text-sm font-bold font-jakarta block" style={{ color: currentTheme.badgeWarning.text }}>
                        NR-31 • CNH Cat. D/E
                    </span>
                    <span className="text-[10px] block" style={{ color: currentTheme.textMuted }}>Habilitado para Tratores & Colheita</span>
                </div>
            </div>

            {/* Main Content Grid (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Cadastral & Professional Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div
                        className="p-5 rounded-2xl border shadow-2xs space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <h3 className="text-xs font-bold uppercase tracking-wider font-jakarta flex items-center gap-2" style={{ color: currentTheme.primary }}>
                            <User className="w-4 h-4" />
                            <span>Informações Pessoais & Contratuais</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="block" style={{ color: currentTheme.textSecondary }}>Nome Completo:</span>
                                <span className="font-semibold text-sm block mt-0.5" style={{ color: currentTheme.textPrimary }}>{collaborator.name}</span>
                            </div>

                            <div>
                                <span className="block" style={{ color: currentTheme.textSecondary }}>Código / Matrícula:</span>
                                <span className="font-mono-code font-bold text-sm block mt-0.5" style={{ color: currentTheme.badgeSuccess.text }}>{collaborator.id}</span>
                            </div>

                            <div>
                                <span className="block" style={{ color: currentTheme.textSecondary }}>E-mail Corporativo:</span>
                                <span className="font-mono-code block mt-0.5" style={{ color: currentTheme.textPrimary }}>{collaborator.email}</span>
                            </div>

                            <div>
                                <span className="block" style={{ color: currentTheme.textSecondary }}>Telefone / WhatsApp:</span>
                                <span className="font-mono-code block mt-0.5" style={{ color: currentTheme.textPrimary }}>{collaborator.phone}</span>
                            </div>

                            <div>
                                <span className="block" style={{ color: currentTheme.textSecondary }}>Função / Cargo:</span>
                                <span className="font-semibold block mt-0.5" style={{ color: currentTheme.textPrimary }}>{collaborator.role}</span>
                            </div>

                            <div>
                                <span className="block" style={{ color: currentTheme.textSecondary }}>Localização Operacional:</span>
                                <span className="font-semibold block mt-0.5" style={{ color: currentTheme.textPrimary }}>{collaborator.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Certificações & Segurança */}
                    <div
                        className="p-5 rounded-2xl border shadow-2xs space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <h3 className="text-xs font-bold uppercase tracking-wider font-jakarta flex items-center gap-2" style={{ color: currentTheme.primary }}>
                            <Award className="w-4 h-4" />
                            <span>Certificações Normativas & Treinamentos</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div
                                className="p-3 rounded-xl border flex items-center gap-3"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: currentTheme.badgeSuccess.text }} />
                                <div>
                                    <span className="text-xs font-bold block" style={{ color: currentTheme.textPrimary }}>NR-31.12 • Segurança em Máquinas</span>
                                    <span className="text-[10px] block font-mono-code" style={{ color: currentTheme.textSecondary }}>Válido até: 14/11/2025</span>
                                </div>
                            </div>

                            <div
                                className="p-3 rounded-xl border flex items-center gap-3"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: currentTheme.badgeSuccess.text }} />
                                <div>
                                    <span className="text-xs font-bold block" style={{ color: currentTheme.textPrimary }}>Operação de Agricultura de Precisão</span>
                                    <span className="text-[10px] block font-mono-code" style={{ color: currentTheme.textSecondary }}>Piloto Automático & RTK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity & OS History */}
                <div className="space-y-6">
                    <div
                        className="p-5 rounded-2xl border shadow-2xs space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <h3 className="text-xs font-bold uppercase tracking-wider font-jakarta flex items-center gap-2" style={{ color: currentTheme.primary }}>
                            <FileText className="w-4 h-4" />
                            <span>Ordens de Serviço Recentes</span>
                        </h3>

                        <div className="space-y-3">
                            <div
                                className="p-3 rounded-xl border space-y-1"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono-code text-xs font-bold" style={{ color: currentTheme.badgeSuccess.text }}>#2024-8841</span>
                                    <span
                                        className="px-2 py-0.5 rounded text-[10px] font-bold border"
                                        style={{
                                            backgroundColor: currentTheme.badgeWarning.bg,
                                            color: currentTheme.badgeWarning.text,
                                            borderColor: currentTheme.badgeWarning.border,
                                        }}
                                    >
                                        Em Andamento
                                    </span>
                                </div>
                                <h4 className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Colheita de Milho Safrinha</h4>
                                <span className="text-[10px] block" style={{ color: currentTheme.textSecondary }}>Talhão 07 • Gleba Norte</span>
                            </div>

                            <div
                                className="p-3 rounded-xl border space-y-1"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono-code text-xs font-bold" style={{ color: currentTheme.badgeSuccess.text }}>#2024-8829</span>
                                    <span
                                        className="px-2 py-0.5 rounded text-[10px] font-bold border"
                                        style={{
                                            backgroundColor: currentTheme.badgeSuccess.bg,
                                            color: currentTheme.badgeSuccess.text,
                                            borderColor: currentTheme.badgeSuccess.border,
                                        }}
                                    >
                                        Concluída
                                    </span>
                                </div>
                                <h4 className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Preparação de Solo & Calagem</h4>
                                <span className="text-[10px] block" style={{ color: currentTheme.textSecondary }}>Talhão 04 • Gleba Sul</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
