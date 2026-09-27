import React, { useState } from 'react';
import { colors, type ThemeMode } from '../../../styles/theme';
import {
    X, Minimize2, MapPin, CheckCircle2, Printer, Edit3,
    Clock, Satellite, Wrench
} from 'lucide-react';

interface OrderServiceModalProps {
    themeMode?: ThemeMode;
    osCode?: string;
    onClose: () => void;
    onComplete?: () => void;
}

export const OrderServiceModal: React.FC<OrderServiceModalProps> = ({
    themeMode = 'dark',
    osCode = 'OS #2024-8839',
    onClose,
    onComplete,
}) => {
    const isDark = themeMode === 'dark';
    const currentTheme = colors[themeMode || 'dark'];
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleCompleteClick = () => {
        setIsCompleting(true);
        setTimeout(() => {
            setIsCompleting(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
            setTimeout(() => {
                onClose();
            }, 800);
        }, 1200);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md overflow-y-auto font-inter ${isDark ? 'bg-[#070a0e]/80' : 'bg-black/40'}`}>
            <div
                className="relative w-full max-w-4xl my-auto rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all border"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
            >
                {/* Accent Strip */}
                <div className="w-full h-1 opacity-80" style={{ background: `linear-gradient(to right, transparent, ${currentTheme.primary}, transparent)` }} />

                {/* Modal Header */}
                <header
                    className="p-6 border-b flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span
                                className="font-mono text-xs tracking-wider px-2.5 py-0.5 rounded border"
                                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                            >
                                {osCode}
                            </span>
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono text-[11px] font-semibold border"
                                style={{
                                    backgroundColor: currentTheme.badgeWarning.bg,
                                    color: currentTheme.badgeWarning.text,
                                    borderColor: currentTheme.badgeWarning.border,
                                }}
                            >
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                EM ANDAMENTO
                            </span>
                            <span className="text-neutral-400">•</span>
                            <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Centro Operacional Morro Grande</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold font-jakarta tracking-tight mt-1" style={{ color: currentTheme.textPrimary }}>
                            Preparação de Solo & Gradagem Pesada
                        </h2>

                        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            <span>CRIADA EM 23/10/2024 ÀS 16:42 • PROTOCOLO AGRO-SEC 481</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-start">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer border hover:opacity-80"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textSecondary }}
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer border hover:opacity-80"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textSecondary }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Modal Body */}
                <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[72vh] scrollbar-none">
                    {/* Localização & Contratante */}
                    <div
                        className="p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors"
                        style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                                style={{
                                    backgroundColor: currentTheme.iconBoxSuccess.bg,
                                    borderColor: currentTheme.iconBoxSuccess.border,
                                    color: currentTheme.iconBoxSuccess.text,
                                }}
                            >
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-wrap items-baseline gap-2">
                                    <span className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>Talhão 14</span>
                                    <span className="text-xs text-neutral-400">— Área Sede (85,4 hectares)</span>
                                </div>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Cooperativa Vale Verde Agrícola S/A <span className="text-neutral-400 mx-1">•</span> Matrícula Gleba 402-A
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border self-start lg:self-auto"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                        >
                            <Satellite className="w-4 h-4 animate-pulse" style={{ color: currentTheme.primary }} />
                            <div className="flex flex-col font-mono">
                                <span className="text-[10px] text-neutral-400 uppercase">GEOFIX RTK</span>
                                <span className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>-21.1784°, -47.8103°</span>
                            </div>
                        </div>
                    </div>

                    {/* Alocação de Recursos (Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Operador */}
                        <div
                            className="p-4 rounded-xl border flex flex-col justify-between gap-4 transition-colors"
                            style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                        >
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: currentTheme.primary }} /> Operador Responsável
                                </span>
                                <span className="text-neutral-400">Turno A • Matr. #084</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center font-jakarta text-sm shadow"
                                    style={{ backgroundColor: currentTheme.primary }}
                                >
                                    MS
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>Marcos Silva</h4>
                                    <span className="text-xs text-neutral-400">Operador Especialista Nível III</span>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium"
                                style={{
                                    backgroundColor: currentTheme.badgeSuccess.bg,
                                    borderColor: currentTheme.badgeSuccess.border,
                                    color: currentTheme.badgeSuccess.text,
                                }}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Treinamento Piloto Automático Ativo</span>
                            </div>
                        </div>

                        {/* Equipamento */}
                        <div
                            className="p-4 rounded-xl border flex flex-col justify-between gap-4 transition-colors"
                            style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                        >
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block" /> Equipamento Vinculado
                                </span>
                                <span className="text-neutral-400">Frota #09</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-11 h-11 rounded-xl border flex items-center justify-center"
                                    style={{
                                        backgroundColor: currentTheme.iconBoxInfo.bg,
                                        borderColor: currentTheme.iconBoxInfo.border,
                                        color: currentTheme.iconBoxInfo.text,
                                    }}
                                >
                                    <Wrench className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>Case Magnum 340</h4>
                                    <span className="text-xs text-neutral-400 font-mono">Horímetro: 4.120h • Potência: 340 CV</span>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
                                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                            >
                                <span className="text-neutral-400">Implemento:</span>
                                <span className="font-medium" style={{ color: currentTheme.textPrimary }}>Grade Aradora Pesada 32 Discos</span>
                            </div>
                        </div>
                    </div>

                    {/* Custos & Jornada */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className="p-4 rounded-xl border flex flex-col justify-between gap-3 transition-colors"
                            style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                        >
                            <span className="text-xs uppercase font-mono text-neutral-400">Controle de Escala & Turno</span>
                            <div className="grid grid-cols-3 gap-2 font-mono">
                                <div>
                                    <span className="text-[10px] text-neutral-400 block">Início</span>
                                    <span className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>06:40</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-neutral-400 block">Término</span>
                                    <span className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>18:30</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-neutral-400 block">HH Acumulado</span>
                                    <span className="text-sm font-bold" style={{ color: currentTheme.primary }}>06h 45m</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-4 rounded-xl border flex flex-col justify-between gap-3 transition-colors"
                            style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                        >
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-neutral-400 uppercase">Custo Parcial Estimado</span>
                                <span
                                    className="text-[10px] px-2 py-0.5 rounded border font-semibold font-mono-code"
                                    style={{
                                        backgroundColor: currentTheme.badgeSuccess.bg,
                                        color: currentTheme.badgeSuccess.text,
                                        borderColor: currentTheme.badgeSuccess.border,
                                    }}
                                >
                                    Auditado CAN
                                </span>
                            </div>
                            <div>
                                <span className="text-xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>R$ 1.285,40</span>
                                <p className="text-[11px] text-neutral-400 mt-0.5">Diesel S10 (124 L) + HH Operador + Depreciação.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <footer
                    className="p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors"
                    style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border hover:opacity-80"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        >
                            Fechar
                        </button>
                        <button
                            type="button"
                            onClick={() => alert('Imprimindo ficha técnica...')}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border hover:opacity-80"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        >
                            <Printer className="w-4 h-4" />
                            <span>Imprimir Ficha</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={() => alert('Abrindo editor de escala...')}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border hover:opacity-80"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Editar Escala</span>
                        </button>
                        <button
                            type="button"
                            disabled={isCompleting || isCompleted}
                            onClick={handleCompleteClick}
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white text-xs font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:opacity-90"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            {isCompleting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Homologando...</span>
                                </>
                            ) : isCompleted ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>O.S. Homologada</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Homologar / Concluir O.S.</span>
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};