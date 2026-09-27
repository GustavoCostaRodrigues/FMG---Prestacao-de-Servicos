import React, { useState } from 'react';
import { colors, type ThemeMode } from '../../../styles/theme';
import { FileText, X, Check, Download, ShieldCheck, Database } from 'lucide-react';

interface ReportExportModalProps {
    themeMode?: ThemeMode;
    onClose: () => void;
    onSuccessExport: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
    themeMode = 'dark',
    onClose,
    onSuccessExport,
}) => {
    const currentTheme = colors[themeMode];
    const isDark = themeMode === 'dark';

    const [selectedScope, setSelectedScope] = useState<'current' | 'all' | 'approved'>('current');
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            onSuccessExport();
            onClose();
        }, 1200);
    };

    return (
        <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300 font-inter ${isDark ? 'bg-[#070a0e]/80' : 'bg-black/40'}`}>
            <div
                className="w-full md:max-w-3xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[88vh] overflow-hidden relative border transition-colors"
                style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    color: currentTheme.textPrimary,
                }}
            >
                {/* Accent Top Border */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${currentTheme.primary}60, ${currentTheme.primary})` }}></div>

                {/* Header */}
                <header
                    className="px-6 py-4 flex items-center justify-between gap-4 border-b relative z-10 transition-colors"
                    style={{
                        backgroundColor: currentTheme.surfaceSecondary,
                        borderColor: currentTheme.border,
                    }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                            style={{
                                backgroundColor: currentTheme.iconBoxSuccess.bg,
                                borderColor: currentTheme.iconBoxSuccess.border,
                                color: currentTheme.iconBoxSuccess.text,
                            }}
                        >
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-base font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                                    Exportar Relatório Executivo em PDF
                                </h1>
                                <span
                                    className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide font-mono"
                                    style={{
                                        backgroundColor: currentTheme.badgeSuccess.bg,
                                        color: currentTheme.badgeSuccess.text,
                                        borderColor: currentTheme.badgeSuccess.border,
                                    }}
                                >
                                    Engine jsPDF 2.5
                                </span>
                            </div>
                            <p className="text-xs mt-0.5 truncate" style={{ color: currentTheme.textSecondary }}>
                                Configure o escopo de dados, orientação da página e detalhamento para emissão técnica.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl transition-colors cursor-pointer border hover:opacity-80"
                        style={{
                            backgroundColor: currentTheme.surface,
                            borderColor: currentTheme.border,
                            color: currentTheme.textSecondary,
                        }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </header>

                {/* Modal Body */}
                <div className="overflow-y-auto p-6 space-y-6 flex-1 scrollbar-none">
                    {/* Seção 1: Escopo e Filtro */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono" style={{ color: currentTheme.textSecondary }}>
                                <span style={{ color: currentTheme.primary }}>01.</span> ESCOPO E FILTRO DOS REGISTROS
                            </label>
                            <span className="text-[10px] px-2 py-0.5 rounded border font-mono" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.textSecondary }}>
                                Filtros Ativos: Safra 2024/2025 • Todas as Operações
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Opção 1: Tela */}
                            <div
                                onClick={() => setSelectedScope('current')}
                                className="p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3"
                                style={{
                                    backgroundColor: selectedScope === 'current' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                    borderColor: selectedScope === 'current' ? currentTheme.primary : currentTheme.border,
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>148 Ordens</span>
                                    <div
                                        className="w-4 h-4 rounded-full border flex items-center justify-center"
                                        style={{ borderColor: selectedScope === 'current' ? currentTheme.primary : currentTheme.border }}
                                    >
                                        {selectedScope === 'current' && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.primary }} />}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-semibold" style={{ color: currentTheme.primary }}>Registros da Tela</span>
                                    <span className="text-[11px]" style={{ color: currentTheme.textSecondary }}>Aplica os filtros ativos na tela atual.</span>
                                </div>
                            </div>

                            {/* Opção 2: Safra */}
                            <div
                                onClick={() => setSelectedScope('all')}
                                className="p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3"
                                style={{
                                    backgroundColor: selectedScope === 'all' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                    borderColor: selectedScope === 'all' ? currentTheme.primary : currentTheme.border,
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>1.420 Ordens</span>
                                    <div
                                        className="w-4 h-4 rounded-full border flex items-center justify-center"
                                        style={{ borderColor: selectedScope === 'all' ? currentTheme.primary : currentTheme.border }}
                                    >
                                        {selectedScope === 'all' && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.primary }} />}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Safra Completa</span>
                                    <span className="text-[11px]" style={{ color: currentTheme.textSecondary }}>Consolidação de todo o ano safra.</span>
                                </div>
                            </div>

                            {/* Opção 3: Homologadas */}
                            <div
                                onClick={() => setSelectedScope('approved')}
                                className="p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3"
                                style={{
                                    backgroundColor: selectedScope === 'approved' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                    borderColor: selectedScope === 'approved' ? currentTheme.primary : currentTheme.border,
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <span className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>124 Ordens</span>
                                    <div
                                        className="w-4 h-4 rounded-full border flex items-center justify-center"
                                        style={{ borderColor: selectedScope === 'approved' ? currentTheme.primary : currentTheme.border }}
                                    >
                                        {selectedScope === 'approved' && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.primary }} />}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Apenas Homologadas</span>
                                    <span className="text-[11px]" style={{ color: currentTheme.textSecondary }}>Somente OS concluídas com custo conferido.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seção 2: Formato e Orientação do Documento (A4) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono" style={{ color: currentTheme.textSecondary }}>
                                <span style={{ color: currentTheme.primary }}>02.</span> FORMATO E ORIENTAÇÃO DO DOCUMENTO (A4)
                            </label>
                            <span className="text-[10px] px-2 py-0.5 rounded border font-mono tracking-wider" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.textSecondary }}>
                                PADRÃO OFICIAL MORRO GRANDE
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Paisagem (Horizontal) */}
                            <div
                                onClick={() => setOrientation('landscape')}
                                className="p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3"
                                style={{
                                    backgroundColor: orientation === 'landscape' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                    borderColor: orientation === 'landscape' ? currentTheme.primary : currentTheme.border,
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: orientation === 'landscape' ? currentTheme.primary : 'transparent' }}
                                        >
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>Paisagem (Horizontal)</span>
                                    </div>
                                    <span
                                        className="px-2 py-0.5 rounded text-[10px] font-semibold font-mono tracking-wider border"
                                        style={{
                                            backgroundColor: currentTheme.badgeSuccess.bg,
                                            color: currentTheme.badgeSuccess.text,
                                            borderColor: currentTheme.badgeSuccess.border,
                                        }}
                                    >
                                        RECOMENDADO
                                    </span>
                                </div>

                                {/* Gráfico Vetorial Detalhado - Paisagem */}
                                <div className="h-28 w-full rounded-lg p-3 flex flex-col justify-between overflow-hidden border shadow-inner" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                                    <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.primary }}></div>
                                            <div className="w-16 h-1 rounded" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                        </div>
                                        <div className="w-10 h-1 rounded opacity-60" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                    </div>
                                    <div className="flex flex-col gap-2 my-auto">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="w-14 h-1.5 rounded opacity-80" style={{ backgroundColor: currentTheme.primary }}></div>
                                            <div className="w-24 h-1.5 rounded opacity-50" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                            <div className="w-28 h-1.5 rounded opacity-30" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                            <div className="w-16 h-1.5 rounded opacity-50" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="w-14 h-1.5 rounded opacity-60" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                            <div className="w-24 h-1.5 rounded opacity-50" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                            <div className="w-28 h-1.5 rounded opacity-30" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                            <div className="w-16 h-1.5 rounded opacity-50" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                        </div>
                                    </div>
                                    <div className="pt-1.5 border-t flex justify-between items-center" style={{ borderColor: currentTheme.border }}>
                                        <div className="w-24 h-1 rounded opacity-40" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                        <div className="w-6 h-1 rounded opacity-60" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-neutral-400 leading-snug">
                                    Ideal para grandes volumes de colunas: telemetria, diesel, operador, horas e custos detalhados.
                                </p>
                            </div>

                            {/* Retrato (Vertical) */}
                            <div
                                onClick={() => setOrientation('portrait')}
                                className="p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3"
                                style={{
                                    backgroundColor: orientation === 'portrait' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                    borderColor: orientation === 'portrait' ? currentTheme.primary : currentTheme.border,
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: orientation === 'portrait' ? currentTheme.primary : 'transparent' }}
                                        >
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>Retrato (Vertical)</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold font-mono tracking-wider border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textSecondary }}>
                                        PADRÃO
                                    </span>
                                </div>

                                {/* Gráfico Vetorial Detalhado - Retrato */}
                                <div className="h-28 w-full rounded-lg p-2 flex items-center justify-center overflow-hidden border shadow-inner" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                                    <div className="h-full w-20 rounded p-2 flex flex-col justify-between shadow-xs border" style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}>
                                        <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: currentTheme.border }}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.primary }}></div>
                                            <div className="w-6 h-1 rounded" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 my-auto">
                                            <div className="w-full h-1.5 rounded opacity-60" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                            <div className="w-3/4 h-1.5 rounded opacity-40" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                            <div className="w-full h-1.5 rounded opacity-40" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                        </div>
                                        <div className="w-full h-1 rounded opacity-60" style={{ backgroundColor: currentTheme.textSecondary }}></div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-neutral-400 leading-snug">
                                    Foco em sumário executivo, parecer agrônomo resumido e auditoria fiscal direta.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Strip */}
                    <div
                        className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono"
                        style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border, color: currentTheme.textSecondary }}
                    >
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4" style={{ color: currentTheme.primary }} />
                            <span>Formato: PDF/A-1b • A4 {orientation === 'landscape' ? 'Paisagem' : 'Retrato'} • Vetorial</span>
                        </div>
                        <span className="flex items-center gap-1 font-semibold" style={{ color: currentTheme.primary }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }} /> Pronto
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <footer
                    className="px-6 py-4 flex items-center justify-between gap-3 border-t shrink-0 transition-colors"
                    style={{
                        backgroundColor: currentTheme.surfaceSecondary,
                        borderColor: currentTheme.border,
                    }}
                >
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px]" style={{ color: currentTheme.textSecondary }}>
                        <ShieldCheck className="w-4 h-4" style={{ color: currentTheme.primary }} />
                        <span>Hash SHA-256 institucional aplicado na assinatura digital</span>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border hover:opacity-80"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textSecondary }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={isGenerating}
                            onClick={handleGenerate}
                            className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 hover:opacity-90"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Compilando Relatório...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    <span>Gerar Relatório PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};