import React from 'react';
import {
    ArrowLeft, Pencil, Tractor, Wrench, Fuel, MapPin, Zap,
    FileText, ShieldCheck, Gauge, Clock, User
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import type { MachineryItem } from './MachineryPage';

export interface MachineryDetailsPageProps {
    machinery: MachineryItem;
    themeMode?: ThemeMode;
    onBack: () => void;
    onEdit?: (machinery: MachineryItem) => void;
    onOpenOS?: (osCode: string) => void;
}

export const MachineryDetailsPage: React.FC<MachineryDetailsPageProps> = ({
    machinery,
    themeMode = 'dark',
    onBack,
    onEdit,
    onOpenOS,
}) => {
    const currentTheme = colors[themeMode || 'dark'];

    const isOperating = machinery.status === 'em_operacao';
    const isMaintenance = machinery.status === 'manutencao';

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
                    <span>Voltar para Lista de Maquinários</span>
                </button>

                <div className="flex items-center gap-2">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(machinery)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Editar Maquinário</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Profile / Machinery Header Banner Card */}
            <div
                className="p-6 rounded-2xl border shadow-sm space-y-6 transition-colors relative overflow-hidden"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-20 h-20 rounded-2xl font-bold text-2xl flex items-center justify-center shadow-md border-2 shrink-0"
                            style={{
                                backgroundColor: currentTheme.iconBoxSuccess.bg,
                                color: currentTheme.iconBoxSuccess.text,
                                borderColor: currentTheme.iconBoxSuccess.border,
                            }}
                        >
                            <Tractor className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                                    {machinery.name}
                                </h1>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold border font-mono-code"
                                    style={{
                                        backgroundColor: currentTheme.badgeNeutral.bg,
                                        color: currentTheme.badgeNeutral.text,
                                        borderColor: currentTheme.badgeNeutral.border,
                                    }}
                                >
                                    {machinery.tag}
                                </span>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold border"
                                    style={{
                                        backgroundColor: isOperating
                                            ? currentTheme.badgeSuccess.bg
                                            : isMaintenance
                                            ? currentTheme.badgeDanger.bg
                                            : currentTheme.badgeNeutral.bg,
                                        color: isOperating
                                            ? currentTheme.badgeSuccess.text
                                            : isMaintenance
                                            ? currentTheme.badgeDanger.text
                                            : currentTheme.badgeNeutral.text,
                                        borderColor: isOperating
                                            ? currentTheme.badgeSuccess.border
                                            : isMaintenance
                                            ? currentTheme.badgeDanger.border
                                            : currentTheme.badgeNeutral.border,
                                    }}
                                >
                                    ● {isOperating ? 'Em Operação' : isMaintenance ? 'Em Manutenção' : 'Disponível'}
                                </span>
                            </div>

                            <p className="text-xs mt-1.5 flex items-center gap-2 flex-wrap font-medium" style={{ color: currentTheme.textSecondary }}>
                                <span className="font-semibold" style={{ color: currentTheme.primary }}>{machinery.category}</span>
                                <span>•</span>
                                <span>{machinery.power}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                                    {machinery.location}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Quick Info Badge */}
                    <div
                        className="p-3.5 rounded-xl border font-mono-code text-xs space-y-1 w-full md:w-auto"
                        style={{
                            backgroundColor: currentTheme.surfaceSecondary,
                            borderColor: currentTheme.border,
                        }}
                    >
                        <div className="flex items-center gap-2 font-bold" style={{ color: currentTheme.badgeSuccess.text }}>
                            <Zap className="w-4 h-4" />
                            <span>Telemetria em Tempo Real</span>
                        </div>
                        <p className="text-[11px]" style={{ color: currentTheme.textSecondary }}>{machinery.telemetry}</p>
                    </div>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Horímetro Acumulado</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.iconBoxSuccess.bg,
                                color: currentTheme.iconBoxSuccess.text,
                                borderColor: currentTheme.iconBoxSuccess.border,
                            }}
                        >
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono-code">
                        <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                            {machinery.hours}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: currentTheme.badgeSuccess.text }}>{machinery.hoursToday}</span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Operador Alocado</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.iconBoxInfo.bg,
                                color: currentTheme.iconBoxInfo.text,
                                borderColor: currentTheme.iconBoxInfo.border,
                            }}
                        >
                            <User className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-jakarta" style={{ color: currentTheme.badgeInfo.text }}>
                            {machinery.operator}
                        </span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Base / Polo Sede</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.iconBoxSuccess.bg,
                                color: currentTheme.iconBoxSuccess.text,
                                borderColor: currentTheme.iconBoxSuccess.border,
                            }}
                        >
                            <MapPin className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold font-jakarta truncate" style={{ color: currentTheme.textPrimary }}>
                            {machinery.base}
                        </span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Consumo de Combustível</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.iconBoxWarning.bg,
                                color: currentTheme.iconBoxWarning.text,
                                borderColor: currentTheme.iconBoxWarning.border,
                            }}
                        >
                            <Fuel className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono-code">
                        <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.badgeWarning.text }}>
                            16.8 L/h
                        </span>
                        <span className="text-xs" style={{ color: currentTheme.textMuted }}>Média Diesel S10</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Technical Specifications & Maintenance Status */}
                <div className="lg:col-span-2 space-y-6">
                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <Gauge className="w-5 h-5" style={{ color: currentTheme.primary }} />
                            <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                Ficha Técnica & Especificações do Equipamento
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="block mb-1" style={{ color: currentTheme.textSecondary }}>Modelo / Fabricante</span>
                                <span className="font-semibold text-sm font-jakarta" style={{ color: currentTheme.textPrimary }}>{machinery.name}</span>
                            </div>

                            <div>
                                <span className="block mb-1" style={{ color: currentTheme.textSecondary }}>Identificação Interna (Tag)</span>
                                <span className="font-mono-code font-bold" style={{ color: currentTheme.badgeSuccess.text }}>{machinery.tag}</span>
                            </div>

                            <div>
                                <span className="block mb-1" style={{ color: currentTheme.textSecondary }}>Categoria do Maquinário</span>
                                <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>{machinery.category}</span>
                            </div>

                            <div>
                                <span className="block mb-1" style={{ color: currentTheme.textSecondary }}>Potência & Implemento</span>
                                <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>{machinery.power}</span>
                            </div>

                            <div>
                                <span className="block mb-1" style={{ color: currentTheme.textSecondary }}>Localização Operacional Atual</span>
                                <span className="font-semibold" style={{ color: currentTheme.badgeSuccess.text }}>{machinery.location}</span>
                            </div>

                            <div>
                                <span className="block mb-1" style={{ color: currentTheme.textSecondary }}>Base Operacional Fixo</span>
                                <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>{machinery.base}</span>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Schedule & Alerts */}
                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <div className="flex items-center gap-2">
                                <Wrench className="w-5 h-5" style={{ color: currentTheme.badgeWarning.text }} />
                                <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                    Plano de Manutenção Preventiva
                                </h2>
                            </div>
                            <span className="text-xs font-mono-code font-semibold" style={{ color: currentTheme.badgeSuccess.text }}>Próxima em +157.6h</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div
                                className="p-4 rounded-xl border space-y-1"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold" style={{ color: currentTheme.textPrimary }}>Troca de Óleo do Motor</span>
                                    <span className="font-mono-code text-[11px]" style={{ color: currentTheme.badgeSuccess.text }}>OK</span>
                                </div>
                                <p className="text-[11px] font-mono-code" style={{ color: currentTheme.textSecondary }}>Realizada com 2.700h • Filtros originais</p>
                            </div>

                            <div
                                className="p-4 rounded-xl border space-y-1"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold" style={{ color: currentTheme.textPrimary }}>Revisão do Sistema Hidráulico</span>
                                    <span className="font-mono-code text-[11px]" style={{ color: currentTheme.badgeWarning.text }}>Agendada</span>
                                </div>
                                <p className="text-[11px] font-mono-code" style={{ color: currentTheme.textSecondary }}>Prevista para 3.000h de operação</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Ordens de Serviço Recentes para este Maquinário */}
                <div className="space-y-6">
                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <FileText className="w-5 h-5" style={{ color: currentTheme.badgeInfo.text }} />
                            <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                Ordens de Serviço Recentes
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div
                                onClick={() => onOpenOS && onOpenOS(`OS #2024-${machinery.id}`)}
                                className="p-3.5 rounded-xl border space-y-1.5 cursor-pointer transition-all"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono-code text-xs font-bold" style={{ color: currentTheme.badgeSuccess.text }}>#OS-2026-104</span>
                                    <span
                                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                                        style={{
                                            backgroundColor: currentTheme.badgeSuccess.bg,
                                            color: currentTheme.badgeSuccess.text,
                                            borderColor: currentTheme.badgeSuccess.border,
                                        }}
                                    >
                                        Em Execução
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>{machinery.category} - Operação Principal</h4>
                                <div className="flex items-center justify-between text-[11px] font-mono-code pt-1 border-t" style={{ color: currentTheme.textSecondary, borderColor: currentTheme.border }}>
                                    <span>Operador: {machinery.operator}</span>
                                    <span>27/09/2026</span>
                                </div>
                            </div>

                            <div
                                className="p-3.5 rounded-xl border space-y-1.5"
                                style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono-code text-xs font-bold" style={{ color: currentTheme.badgeInfo.text }}>#OS-2026-078</span>
                                    <span
                                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                                        style={{
                                            backgroundColor: currentTheme.badgeInfo.bg,
                                            color: currentTheme.badgeInfo.text,
                                            borderColor: currentTheme.badgeInfo.border,
                                        }}
                                    >
                                        Concluído
                                    </span>
                                </div>
                                <h4 className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Preparo Solo & Subsolagem Profunda</h4>
                                <div className="flex items-center justify-between text-[11px] font-mono-code pt-1 border-t" style={{ color: currentTheme.textSecondary, borderColor: currentTheme.border }}>
                                    <span>Talhão 14 - Soja</span>
                                    <span>21/09/2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <ShieldCheck className="w-5 h-5" style={{ color: currentTheme.primary }} />
                            <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                Segurança & Documentação
                            </h2>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span style={{ color: currentTheme.textSecondary }}>Seguro de Máquina:</span>
                                <span className="font-semibold" style={{ color: currentTheme.badgeSuccess.text }}>Válido até 12/2027</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span style={{ color: currentTheme.textSecondary }}>Certificado NR-31:</span>
                                <span className="font-mono-code" style={{ color: currentTheme.textPrimary }}>Conforme</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

