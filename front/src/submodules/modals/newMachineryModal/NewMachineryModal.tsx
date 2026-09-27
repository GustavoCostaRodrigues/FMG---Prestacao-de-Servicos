import React, { useState } from 'react';
import { colors, type ThemeMode } from '../../../styles/theme';
import { X, Check, Tractor, ShieldCheck, Gauge, Cpu } from 'lucide-react';

export interface NewMachineryModalProps {
    themeMode?: ThemeMode;
    onClose: () => void;
    onSuccessCreate?: (newMachineData: any) => void;
}

export const NewMachineryModal: React.FC<NewMachineryModalProps> = ({
    themeMode = 'dark',
    onClose,
    onSuccessCreate,
}) => {
    const currentTheme = colors[themeMode || 'dark'];

    // Form fields
    const [modelName, setModelName] = useState('');
    const [fleetTag, setFleetTag] = useState('');
    const [category, setCategory] = useState('Trator');
    const [brand, setBrand] = useState('Case IH');
    const [horsepower, setHorsepower] = useState(340);
    const [initialHours, setInitialHours] = useState(0);
    const [telemetryModuleId, setTelemetryModuleId] = useState('');
    const [allocatedBase, setAllocatedBase] = useState('Polo Sede - Morro Grande');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            const newMachine = {
                id: String(Date.now()),
                name: modelName || 'Case Magnum 340',
                tag: fleetTag || `#${Math.floor(10 + Math.random() * 90)} | TR-${Math.floor(10 + Math.random() * 90)}`,
                category,
                brand,
                horsepower,
                hours: initialHours,
                telemetryModuleId: telemetryModuleId || `CAN-NODE-${Math.floor(100 + Math.random() * 900)}`,
                base: allocatedBase,
                status: 'disponivel',
            };
            if (onSuccessCreate) onSuccessCreate(newMachine);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300 font-inter bg-black/50">
            <div
                className="w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[88vh] overflow-hidden relative border transition-colors"
                style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    color: currentTheme.textPrimary,
                }}
            >
                {/* Accent Top Border */}
                <div className="h-1 w-full" style={{ backgroundColor: currentTheme.primary }} />

                {/* Modal Header */}
                <header
                    className="px-6 py-4 flex items-center justify-between gap-4 border-b relative z-10"
                    style={{
                        backgroundColor: currentTheme.surface,
                        borderColor: currentTheme.border,
                    }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                            style={{
                                backgroundColor: currentTheme.iconBoxSuccess.bg,
                                color: currentTheme.iconBoxSuccess.text,
                                borderColor: currentTheme.iconBoxSuccess.border,
                            }}
                        >
                            <Tractor className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold font-jakarta tracking-tight truncate" style={{ color: currentTheme.textPrimary }}>
                                Cadastrar Novo Maquinário
                            </h2>
                            <p className="text-xs truncate mt-0.5" style={{ color: currentTheme.textSecondary }}>
                                Adicionar ativo à frota operacional e vincular módulo telemétrico CAN-Bus
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl border transition-colors cursor-pointer shrink-0"
                        style={{
                            backgroundColor: currentTheme.surfaceSecondary,
                            borderColor: currentTheme.border,
                            color: currentTheme.textSecondary,
                        }}
                        title="Fechar Modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </header>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Section 1: Dados Básicos */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                            <Tractor className="w-4 h-4" />
                            <span>1. Identificação da Máquina</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    Modelo / Nome da Máquina *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                    placeholder="ex: Case Magnum 340"
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    Código / TAG de Frota *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fleetTag}
                                    onChange={(e) => setFleetTag(e.target.value)}
                                    placeholder="ex: #09 | TR-09"
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono-code focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    Categoria do Equipamento
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.dropdownBg,
                                        borderColor: currentTheme.border,
                                        color: currentTheme.textPrimary,
                                    }}
                                >
                                    <option value="Trator">Trator Agrícola</option>
                                    <option value="Colheitadeira">Colheitadeira de Grãos</option>
                                    <option value="Pulverizador">Pulverizador Autopropelido</option>
                                    <option value="Drone">Drone de Pulverização</option>
                                    <option value="Implemento">Implemento / Plantadeira</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    Marca / Fabricante
                                </label>
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.dropdownBg,
                                        borderColor: currentTheme.border,
                                        color: currentTheme.textPrimary,
                                    }}
                                >
                                    <option value="Case IH">Case IH</option>
                                    <option value="John Deere">John Deere</option>
                                    <option value="New Holland">New Holland</option>
                                    <option value="Valtra">Valtra</option>
                                    <option value="Massey Ferguson">Massey Ferguson</option>
                                    <option value="DJI">DJI Agras</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Especificações Técnicas */}
                    <div className="border-t pt-4" style={{ borderColor: currentTheme.border }}>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                            <Gauge className="w-4 h-4" />
                            <span>2. Especificações & Horímetro</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    Potência do Motor (cv / hp)
                                </label>
                                <input
                                    type="number"
                                    value={horsepower}
                                    onChange={(e) => setHorsepower(Number(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono-code focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    Horímetro Acumulado Inicial (h)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={initialHours}
                                    onChange={(e) => setInitialHours(Number(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono-code focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Telemetria & Base Alocada */}
                    <div className="border-t pt-4" style={{ borderColor: currentTheme.border }}>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta flex items-center gap-1.5" style={{ color: currentTheme.primary }}>
                            <Cpu className="w-4 h-4" />
                            <span>3. Telemetria CAN-Bus & Alocação</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    ID do Módulo Teleférico (CAN-Bus)
                                </label>
                                <input
                                    type="text"
                                    value={telemetryModuleId}
                                    onChange={(e) => setTelemetryModuleId(e.target.value)}
                                    placeholder="ex: CAN-NODE-883"
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono-code focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: currentTheme.textSecondary }}>
                                    Polo / Base de Origem
                                </label>
                                <select
                                    value={allocatedBase}
                                    onChange={(e) => setAllocatedBase(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer focus:outline-none"
                                    style={{
                                        backgroundColor: currentTheme.dropdownBg,
                                        borderColor: currentTheme.border,
                                        color: currentTheme.textPrimary,
                                    }}
                                >
                                    <option value="Polo Sede - Morro Grande">Polo Sede - Morro Grande</option>
                                    <option value="Unidade Boa Vista">Unidade Boa Vista</option>
                                    <option value="Ponto de Apoio Norte">Ponto de Apoio Norte</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-3.5 rounded-xl border flex items-center gap-2 text-xs font-mono-code"
                        style={{
                            backgroundColor: currentTheme.badgeSuccess.bg,
                            borderColor: currentTheme.badgeSuccess.border,
                            color: currentTheme.badgeSuccess.text,
                        }}
                    >
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Sincronização automática via Starlink IoT CAN-Bus habilitada.</span>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t" style={{ borderColor: currentTheme.border }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                            style={{
                                backgroundColor: currentTheme.surfaceSecondary,
                                borderColor: currentTheme.border,
                                color: currentTheme.textPrimary,
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-md disabled:opacity-50"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            <Check className="w-4 h-4" />
                            <span>{isSubmitting ? 'Salvando...' : 'Cadastrar Maquinário'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

