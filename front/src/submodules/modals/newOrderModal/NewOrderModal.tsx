import React, { useState, useMemo } from 'react';
import { colors, type ThemeMode } from '../../../styles/theme';
import {
    X, Check, ArrowLeft, ArrowRight, Sprout, Droplet,
    Layers, Package, ShieldCheck, CheckSquare, Zap, Tractor,
    Building2, MapPin
} from 'lucide-react';

export interface NewOrderModalProps {
    themeMode?: ThemeMode;
    onClose: () => void;
    onSuccessCreate?: (newOrderData: any) => void;
}

type StepType = 1 | 2 | 3;
type PricingModel = 'hectare' | 'hora' | 'fixo';

interface OperationOption {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    icon: React.ElementType;
    defaultUnitPrice: number;
    defaultDuration: string;
    defaultInputs: string;
}

const OPERATIONS_LIST: OperationOption[] = [
    {
        id: 'preparo',
        title: 'Preparação de Solo',
        subtitle: 'Descompactação, Calagem & Subsolagem',
        category: 'Solo',
        icon: Layers,
        defaultUnitPrice: 270.00,
        defaultDuration: '08h 00m (1 Turno)',
        defaultInputs: '120 Ton Calcário Dolo',
    },
    {
        id: 'plantio',
        title: 'Plantio & Semeadura',
        subtitle: 'Safra Principal / Safrinha de Precisão',
        category: 'Plantio',
        icon: Sprout,
        defaultUnitPrice: 310.00,
        defaultDuration: '10h 30m (1 Turno)',
        defaultInputs: '48 sacas TMG 7062',
    },
    {
        id: 'pulverizacao',
        title: 'Pulverização Agrícola',
        subtitle: 'Defensivos, Fúngicos & Fertirrigação',
        category: 'Aplicação',
        icon: Droplet,
        defaultUnitPrice: 195.00,
        defaultDuration: '04h 30m (Meio Turno)',
        defaultInputs: '320L Defensivo Nível 1',
    },
    {
        id: 'colheita',
        title: 'Colheita de Grãos',
        subtitle: 'Cereais & Oleaginosas com Telemetria',
        category: 'Colheita',
        icon: Package,
        defaultUnitPrice: 435.00,
        defaultDuration: '12h 00m (Turno Duplo)',
        defaultInputs: 'Tanque 450L Diesel S10',
    },
];

interface Establishment {
    id: string;
    name: string;
    areaHa: number;
    isDefault: boolean;
}

interface ClientOption {
    id: string;
    name: string;
    document: string;
    establishments: Establishment[];
}

const CLIENTS_LIST: ClientOption[] = [
    {
        id: 'c1',
        name: 'Agropecuária Santa Fé S.A.',
        document: 'CNPJ: 14.892.102/0001-44',
        establishments: [
            { id: 'e1', name: 'Sede Fazenda Santa Fé (Matriz)', areaHa: 142, isDefault: true },
            { id: 'e2', name: 'Unidade Operacional II • Setor Leste', areaHa: 98, isDefault: false },
        ],
    },
    {
        id: 'c2',
        name: 'Cooperativa Vale Verde',
        document: 'CNPJ: 08.431.908/0001-12',
        establishments: [
            { id: 'e3', name: 'Sede Central Vale Verde • Gleba Norte', areaHa: 215, isDefault: true },
            { id: 'e4', name: 'Posto Avulso • Fazenda Cachoeira', areaHa: 85, isDefault: false },
        ],
    },
    {
        id: 'c3',
        name: 'Fazenda Morro Grande (Própria)',
        document: 'Inscrição Estadual: 901.442.10-88',
        establishments: [
            { id: 'e5', name: 'Sede Fazenda Morro Grande • Setor Central', areaHa: 320, isDefault: true },
            { id: 'e6', name: 'Retiro Velho • Setor Oeste', areaHa: 110, isDefault: false },
        ],
    },
];

const OPERATORS_LIST = [
    { id: 'op1', name: 'Marcos Silva', role: 'Operador Sênior', status: 'Disponível' },
    { id: 'op2', name: 'Rodrigo Morais', role: 'Técnico em Aplicação', status: 'Disponível' },
    { id: 'op3', name: 'Carlos Mendes', role: 'Operador Especialista', status: 'Disponível' },
    { id: 'op4', name: 'Lucas Guedes', role: 'Operador Pleno', status: 'Em Intervalo' },
];

const EQUIPMENT_LIST = [
    { id: 'eq1', name: 'Case Magnum 340', code: 'TRAT-09', telemetry: 'RTK Fixado • 12 Sat', status: 'Operacional' },
    { id: 'eq2', name: 'John Deere S770', code: 'COLH-02', telemetry: 'RTK Ok • Umidade Sensor', status: 'Operacional' },
    { id: 'eq3', name: 'Patriot 350', code: 'PULV-04', telemetry: 'Vazão 120 L/ha Ok', status: 'Operacional' },
    { id: 'eq4', name: 'Valtra T250', code: 'TRAT-14', telemetry: 'RTK Conectado', status: 'Standby' },
];

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
    themeMode = 'dark',
    onClose,
    onSuccessCreate,
}) => {
    const currentTheme = colors[themeMode || 'dark'];

    // Step state
    const [step, setStep] = useState<StepType>(1);

    // Step 1 states: Tipo de Operação, Cliente & Estabelecimento (com área)
    const [selectedOpId, setSelectedOpId] = useState<string>('preparo');
    const [selectedClientId, setSelectedClientId] = useState<string>('c1');
    const [selectedEstId, setSelectedEstId] = useState<string>('e1'); // Pre-selected "Sede"

    // Step 2 states: Equipe & Maquinário
    const [selectedOpUserId, setSelectedOpUserId] = useState<string>('op1');
    const [selectedEqId, setSelectedEqId] = useState<string>('eq1');

    // Step 3 states: Janela, Precificação & Resumo
    const [shiftWindow, setShiftWindow] = useState<string>('Manhã (06h - 12h)');
    const [startDate, setStartDate] = useState<string>('Hoje, 07:00');
    const [pricingModel, setPricingModel] = useState<PricingModel>('hectare');
    const [unitPriceInput, setUnitPriceInput] = useState<number>(270);
    const [paymentTerms, setPaymentTerms] = useState<string>('Faturamento 30 Dias / Medição Mensal');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Derived Objects
    const currentOp = OPERATIONS_LIST.find(o => o.id === selectedOpId) || OPERATIONS_LIST[0];
    const currentClient = CLIENTS_LIST.find(c => c.id === selectedClientId) || CLIENTS_LIST[0];
    const currentEst = currentClient.establishments.find(e => e.id === selectedEstId) || currentClient.establishments[0];
    const currentOperator = OPERATORS_LIST.find(op => op.id === selectedOpUserId) || OPERATORS_LIST[0];
    const currentEq = EQUIPMENT_LIST.find(eq => eq.id === selectedEqId) || EQUIPMENT_LIST[0];

    // Calculated Total Cost using Establishment Area Size
    const totalCalculatedCost = useMemo(() => {
        if (pricingModel === 'hectare') {
            return currentEst.areaHa * unitPriceInput;
        } else if (pricingModel === 'hora') {
            return 8 * unitPriceInput; // default 8h shift
        } else {
            return unitPriceInput;
        }
    }, [pricingModel, currentEst.areaHa, unitPriceInput]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const handleConfirmSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            const newOrder = {
                id: String(Date.now()),
                code: `#2024-${Math.floor(1000 + Math.random() * 9000)}`,
                shift: shiftWindow,
                operationName: `${currentOp.title} & ${currentOp.subtitle.split(',')[0]}`,
                plotDetails: currentEst.name,
                areaHa: currentEst.areaHa,
                clientName: currentClient.name,
                operatorName: currentOperator.name,
                operatorRole: currentOperator.role,
                equipmentName: currentEq.name,
                equipmentCode: currentEq.code,
                status: 'agendada',
                elapsedHours: '00h 00m',
                estimatedHours: currentOp.defaultDuration.split(' ')[0],
                cost: totalCalculatedCost,
            };
            if (onSuccessCreate) onSuccessCreate(newOrder);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#070a0e]/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300 font-inter">
            <div
                className="w-full md:max-w-4xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-hidden relative border transition-colors"
                style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    color: currentTheme.textPrimary,
                }}
            >
                {/* Top Accent Gradient */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-600/40 via-emerald-500 to-emerald-400" />

                {/* 1. Header do Modal */}
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
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg font-bold font-jakarta tracking-tight truncate" style={{ color: currentTheme.textPrimary }}>
                                    Nova Ordem de Serviço
                                </h2>
                                <span
                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono-code uppercase tracking-wider border"
                                    style={{
                                        backgroundColor: currentTheme.badgeSuccess.bg,
                                        color: currentTheme.badgeSuccess.text,
                                        borderColor: currentTheme.badgeSuccess.border,
                                    }}
                                >
                                    CRIAÇÃO RÁPIDA
                                </span>
                            </div>
                            <p className="text-xs text-neutral-400 truncate mt-0.5">
                                Preencha os 3 passos guiados para despachar a operação de campo
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl border transition-colors cursor-pointer shrink-0 hover:opacity-80"
                        style={{
                            backgroundColor: currentTheme.surface,
                            borderColor: currentTheme.border,
                            color: currentTheme.textSecondary,
                        }}
                        title="Fechar Modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </header>

                {/* 2. Stepper / Indicador de Passos */}
                <div
                    className="px-6 py-3 border-b flex items-center justify-between gap-2 font-jakarta transition-colors"
                    style={{
                        backgroundColor: currentTheme.surfaceSecondary,
                        borderColor: currentTheme.border,
                    }}
                >
                    {/* Passo 1 */}
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                        style={{
                            backgroundColor: step === 1 ? currentTheme.primary : currentTheme.surface,
                            color: step === 1 ? '#FFFFFF' : currentTheme.textSecondary,
                            borderColor: step === 1 ? currentTheme.primary : currentTheme.border,
                        }}
                    >
                        <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                                backgroundColor: step === 1 ? '#FFFFFF' : currentTheme.surfaceSecondary,
                                color: step === 1 ? currentTheme.primary : currentTheme.textSecondary,
                            }}
                        >
                            1
                        </span>
                        <span>Operação & Cliente</span>
                    </button>

                    <div className="h-0.5 flex-1 max-w-[30px] rounded" style={{ backgroundColor: currentTheme.border }} />

                    {/* Passo 2 */}
                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                        style={{
                            backgroundColor: step === 2 ? currentTheme.primary : currentTheme.surface,
                            color: step === 2 ? '#FFFFFF' : currentTheme.textSecondary,
                            borderColor: step === 2 ? currentTheme.primary : currentTheme.border,
                        }}
                    >
                        <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                                backgroundColor: step === 2 ? '#FFFFFF' : currentTheme.surfaceSecondary,
                                color: step === 2 ? currentTheme.primary : currentTheme.textSecondary,
                            }}
                        >
                            2
                        </span>
                        <span>Equipe & Maquinário</span>
                    </button>

                    <div className="h-0.5 flex-1 max-w-[30px] rounded" style={{ backgroundColor: currentTheme.border }} />

                    {/* Passo 3 */}
                    <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                        style={{
                            backgroundColor: step === 3 ? currentTheme.primary : currentTheme.surface,
                            color: step === 3 ? '#FFFFFF' : currentTheme.textSecondary,
                            borderColor: step === 3 ? currentTheme.primary : currentTheme.border,
                        }}
                    >
                        <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                                backgroundColor: step === 3 ? '#FFFFFF' : currentTheme.surfaceSecondary,
                                color: step === 3 ? currentTheme.primary : currentTheme.textSecondary,
                            }}
                        >
                            3
                        </span>
                        <span>Janela, Precificação & Resumo</span>
                    </button>
                </div>

                {/* 3. Conteúdo Central (Grid de 2 Colunas no Desktop) */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna Esquerda: Formulário de Configuração (Ocupa 2 colunas) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* PASSO 1: OPERAÇÃO, CLIENTE & ESTABELECIMENTO */}
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                {/* Linha 1: Tipo de Operação */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta" style={{ color: currentTheme.primary }}>
                                        Passo 1 • Tipo de Operação Agrícola
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {OPERATIONS_LIST.map((op) => {
                                            const Icon = op.icon;
                                            const isSelected = selectedOpId === op.id;
                                            return (
                                                <button
                                                    key={op.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedOpId(op.id);
                                                        setUnitPriceInput(op.defaultUnitPrice);
                                                    }}
                                                    className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative"
                                                    style={{
                                                        backgroundColor: isSelected ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                                        borderColor: isSelected ? currentTheme.primary : currentTheme.border,
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div
                                                            className="p-2 rounded-xl border"
                                                            style={{
                                                                backgroundColor: isSelected ? currentTheme.iconBoxSuccess.bg : currentTheme.surface,
                                                                borderColor: isSelected ? currentTheme.iconBoxSuccess.border : currentTheme.border,
                                                                color: isSelected ? currentTheme.iconBoxSuccess.text : currentTheme.textSecondary,
                                                            }}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        {isSelected && (
                                                            <span
                                                                className="w-5 h-5 rounded-full text-white flex items-center justify-center font-bold"
                                                                style={{ backgroundColor: currentTheme.primary }}
                                                            >
                                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="text-xs font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                                        {op.title}
                                                    </h4>
                                                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                                                        {op.subtitle}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Linha 2: Cliente Contratante (Linha Separada) */}
                                <div className="border-t pt-4" style={{ borderColor: currentTheme.border }}>
                                    <label className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-jakarta" style={{ color: currentTheme.primary }}>
                                        <Building2 className="w-4 h-4" style={{ color: currentTheme.primary }} />
                                        <span>Cliente Contratante</span>
                                    </label>
                                    <select
                                        value={selectedClientId}
                                        onChange={(e) => {
                                            const newClientId = e.target.value;
                                            setSelectedClientId(newClientId);
                                            const clientObj = CLIENTS_LIST.find(c => c.id === newClientId);
                                            if (clientObj) {
                                                const defaultEst = clientObj.establishments.find(est => est.isDefault) || clientObj.establishments[0];
                                                setSelectedEstId(defaultEst.id);
                                            }
                                        }}
                                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none"
                                        style={{
                                            backgroundColor: currentTheme.dropdownBg,
                                            borderColor: currentTheme.border,
                                            color: currentTheme.textPrimary,
                                        }}
                                    >
                                        {CLIENTS_LIST.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.document})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Linha 3: Estabelecimento & Tamanho da Área (Linha Separada com Sede Pré-selecionada) */}
                                <div className="border-t pt-4 space-y-2.5" style={{ borderColor: currentTheme.border }}>
                                    <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between font-jakarta" style={{ color: currentTheme.primary }}>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" style={{ color: currentTheme.primary }} />
                                            <span>Estabelecimento & Área de Atuação</span>
                                        </div>
                                        <span className="text-[10px] font-mono-code text-neutral-400 lowercase">
                                            (sede pré-selecionada)
                                        </span>
                                    </label>

                                    <div className="grid grid-cols-1 gap-2.5">
                                        {currentClient.establishments.map((est) => {
                                            const isSelected = selectedEstId === est.id;
                                            return (
                                                <button
                                                    key={est.id}
                                                    type="button"
                                                    onClick={() => setSelectedEstId(est.id)}
                                                    className="p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between"
                                                    style={{
                                                        backgroundColor: isSelected ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                                        borderColor: isSelected ? currentTheme.primary : currentTheme.border,
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <MapPin className="w-4 h-4 shrink-0" style={{ color: isSelected ? currentTheme.primary : currentTheme.textSecondary }} />
                                                        <div className="min-w-0">
                                                            <span className="text-xs font-semibold block truncate" style={{ color: currentTheme.textPrimary }}>
                                                                {est.name}
                                                            </span>
                                                            {est.isDefault && (
                                                                <span className="text-[10px] font-mono-code font-bold block" style={{ color: currentTheme.primary }}>
                                                                    ★ Estabelecimento Sede (Padrão)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span
                                                            className="text-xs font-bold font-mono-code px-2.5 py-1 rounded border"
                                                            style={{
                                                                backgroundColor: currentTheme.badgeSuccess.bg,
                                                                color: currentTheme.badgeSuccess.text,
                                                                borderColor: currentTheme.badgeSuccess.border,
                                                            }}
                                                        >
                                                            Área: {est.areaHa} ha
                                                        </span>
                                                        {isSelected && (
                                                            <span className="w-5 h-5 rounded-full text-white flex items-center justify-center" style={{ backgroundColor: currentTheme.primary }}>
                                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASSO 2: EQUIPE & MAQUINÁRIO */}
                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta" style={{ color: currentTheme.primary }}>
                                        Passo 2 • Operador Escalado
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {OPERATORS_LIST.map((op) => {
                                            const isSelected = selectedOpUserId === op.id;
                                            return (
                                                <button
                                                    key={op.id}
                                                    type="button"
                                                    onClick={() => setSelectedOpUserId(op.id)}
                                                    className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer"
                                                    style={{
                                                        backgroundColor: isSelected ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                                        borderColor: isSelected ? currentTheme.primary : currentTheme.border,
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono-code border"
                                                            style={{
                                                                backgroundColor: currentTheme.badgeSuccess.bg,
                                                                borderColor: currentTheme.badgeSuccess.border,
                                                                color: currentTheme.badgeSuccess.text,
                                                            }}
                                                        >
                                                            {op.name.split(' ').map(n=>n[0]).join('')}
                                                        </div>
                                                        <span
                                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full border font-mono-code"
                                                            style={{
                                                                backgroundColor: currentTheme.badgeSuccess.bg,
                                                                color: currentTheme.badgeSuccess.text,
                                                                borderColor: currentTheme.badgeSuccess.border,
                                                            }}
                                                        >
                                                            {op.status}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-xs font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                                        {op.name}
                                                    </h4>
                                                    <span className="text-[10px] text-neutral-400 font-mono-code">
                                                        {op.role}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t pt-4" style={{ borderColor: currentTheme.border }}>
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta" style={{ color: currentTheme.primary }}>
                                        Maquinário & Frota Vinculada
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {EQUIPMENT_LIST.map((eq) => {
                                            const isSelected = selectedEqId === eq.id;
                                            return (
                                                <button
                                                    key={eq.id}
                                                    type="button"
                                                    onClick={() => setSelectedEqId(eq.id)}
                                                    className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer"
                                                    style={{
                                                        backgroundColor: isSelected ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                                        borderColor: isSelected ? currentTheme.primary : currentTheme.border,
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <Tractor className="w-4 h-4" style={{ color: currentTheme.primary }} />
                                                            <span className="text-xs font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                                                {eq.name}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className="text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded border"
                                                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.textSecondary }}
                                                        >
                                                            {eq.code}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-mono-code block" style={{ color: currentTheme.primary }}>
                                                        {eq.telemetry}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PASSO 3: JANELA, PRECIFICAÇÃO & RESUMO */}
                        {step === 3 && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                {/* Janela de Execução */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta" style={{ color: currentTheme.primary }}>
                                        Passo 3 • Janela de Execução & Turno
                                    </h3>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div
                                            className="p-3.5 rounded-2xl border transition-colors"
                                            style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                                        >
                                            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
                                                Turno Programado
                                            </label>
                                            <select
                                                value={shiftWindow}
                                                onChange={(e) => setShiftWindow(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer focus:outline-none"
                                                style={{
                                                    backgroundColor: currentTheme.dropdownBg,
                                                    borderColor: currentTheme.border,
                                                    color: currentTheme.textPrimary,
                                                }}
                                            >
                                                <option value="Manhã (06h - 12h)">Manhã (06h - 12h)</option>
                                                <option value="Tarde (13h - 18h)">Tarde (13h - 18h)</option>
                                                <option value="Noite (19h - 02h)">Noite (19h - 02h)</option>
                                                <option value="Manhã / Tarde">Manhã / Tarde Integral</option>
                                            </select>
                                        </div>

                                        <div
                                            className="p-3.5 rounded-2xl border transition-colors"
                                            style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                                        >
                                            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
                                                Data & Horário de Início
                                            </label>
                                            <input
                                                type="text"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border text-xs font-mono-code focus:outline-none"
                                                style={{
                                                    backgroundColor: currentTheme.inputBg,
                                                    borderColor: currentTheme.inputBorder,
                                                    color: currentTheme.inputText,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Campos de Precificação */}
                                <div className="border-t pt-4" style={{ borderColor: currentTheme.border }}>
                                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 font-jakarta" style={{ color: currentTheme.primary }}>
                                        Campos de Precificação & Faturamento
                                    </h3>

                                    {/* Modelo de Cobrança */}
                                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setPricingModel('hectare')}
                                            className="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
                                            style={{
                                                backgroundColor: pricingModel === 'hectare' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                                borderColor: pricingModel === 'hectare' ? currentTheme.primary : currentTheme.border,
                                                color: pricingModel === 'hectare' ? currentTheme.primary : currentTheme.textSecondary,
                                                fontWeight: pricingModel === 'hectare' ? 'bold' : 'normal',
                                            }}
                                        >
                                            <span className="text-xs block">Por Hectare</span>
                                            <span className="text-[10px] font-mono-code opacity-75">R$ / ha</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPricingModel('hora')}
                                            className="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
                                            style={{
                                                backgroundColor: pricingModel === 'hora' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                                borderColor: pricingModel === 'hora' ? currentTheme.primary : currentTheme.border,
                                                color: pricingModel === 'hora' ? currentTheme.primary : currentTheme.textSecondary,
                                                fontWeight: pricingModel === 'hora' ? 'bold' : 'normal',
                                            }}
                                        >
                                            <span className="text-xs block">Por Hora</span>
                                            <span className="text-[10px] font-mono-code opacity-75">R$ / hora</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPricingModel('fixo')}
                                            className="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
                                            style={{
                                                backgroundColor: pricingModel === 'fixo' ? currentTheme.badgeSuccess.bg : currentTheme.surfaceSecondary,
                                                borderColor: pricingModel === 'fixo' ? currentTheme.primary : currentTheme.border,
                                                color: pricingModel === 'fixo' ? currentTheme.primary : currentTheme.textSecondary,
                                                fontWeight: pricingModel === 'fixo' ? 'bold' : 'normal',
                                            }}
                                        >
                                            <span className="text-xs block">Valor Fixo</span>
                                            <span className="text-[10px] font-mono-code opacity-75">Empreitada</span>
                                        </button>
                                    </div>

                                    {/* Valor Unitário & Total Dinâmico */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div
                                            className="p-3.5 rounded-2xl border transition-colors"
                                            style={{ backgroundColor: currentTheme.surfaceSecondary, borderColor: currentTheme.border }}
                                        >
                                            <label className="text-xs font-semibold text-neutral-400 block mb-1.5">
                                                Valor Unitário (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-code text-neutral-500">R$</span>
                                                <input
                                                    type="number"
                                                    value={unitPriceInput}
                                                    onChange={(e) => setUnitPriceInput(Number(e.target.value) || 0)}
                                                    className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-mono-code font-bold focus:outline-none"
                                                    style={{
                                                        backgroundColor: currentTheme.inputBg,
                                                        borderColor: currentTheme.inputBorder,
                                                        color: currentTheme.primary,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className="p-3.5 rounded-2xl border flex flex-col justify-center transition-colors"
                                            style={{
                                                backgroundColor: currentTheme.badgeSuccess.bg,
                                                borderColor: currentTheme.badgeSuccess.border,
                                            }}
                                        >
                                            <span className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: currentTheme.primary }}>
                                                Total Calculado ({currentEst.areaHa} ha)
                                            </span>
                                            <span className="text-lg font-bold font-jakarta font-mono-code mt-0.5" style={{ color: currentTheme.primary }}>
                                                {formatCurrency(totalCalculatedCost)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Condição de Faturamento */}
                                    <div className="mt-3">
                                        <label className="text-xs font-semibold text-neutral-400 block mb-1">
                                            Condições de Faturamento & Pagamento
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentTerms}
                                            onChange={(e) => setPaymentTerms(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none"
                                            style={{
                                                backgroundColor: currentTheme.inputBg,
                                                borderColor: currentTheme.inputBorder,
                                                color: currentTheme.inputText,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="p-3.5 rounded-2xl border space-y-1 transition-colors"
                                    style={{
                                        backgroundColor: currentTheme.badgeSuccess.bg,
                                        borderColor: currentTheme.badgeSuccess.border,
                                    }}
                                >
                                    <div className="flex items-center gap-2 font-semibold text-xs font-jakarta" style={{ color: currentTheme.primary }}>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Validação & Telemetria RTK Checada</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                                        A O.S. será sincronizada automaticamente no painel de bordo da máquina e disponibilizada para faturamento.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coluna Direita: Resumo Executivo Compacto (Ocupa 1 coluna) */}
                    <div
                        className="p-5 rounded-2xl border shadow-sm flex flex-col justify-between space-y-4 font-inter transition-colors"
                        style={{
                            backgroundColor: currentTheme.surfaceSecondary,
                            borderColor: currentTheme.border,
                        }}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.border }}>
                                <h3 className="text-xs font-bold uppercase tracking-wider font-jakarta" style={{ color: currentTheme.primary }}>
                                    Resumo Executivo
                                </h3>
                                <span
                                    className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-code border"
                                    style={{
                                        backgroundColor: currentTheme.badgeSuccess.bg,
                                        color: currentTheme.badgeSuccess.text,
                                        borderColor: currentTheme.badgeSuccess.border,
                                    }}
                                >
                                    PASSO {step}/3
                                </span>
                            </div>

                            {/* Operação Selecionada */}
                            <div>
                                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                                    Operação
                                </span>
                                <h4 className="text-sm font-bold font-jakarta mt-0.5" style={{ color: currentTheme.textPrimary }}>
                                    {currentOp.title}
                                </h4>
                                <span className="text-[11px] text-neutral-400 font-medium block">
                                    {currentOp.subtitle}
                                </span>
                            </div>

                            {/* Cliente & Estabelecimento */}
                            <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentTheme.border }}>
                                <div>
                                    <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                                        Cliente & Estabelecimento
                                    </span>
                                    <span className="text-xs font-semibold block truncate" style={{ color: currentTheme.primary }}>
                                        {currentClient.name}
                                    </span>
                                    <span className="text-[11px] block truncate mt-0.5 font-medium" style={{ color: currentTheme.textPrimary }}>
                                        {currentEst.name}
                                    </span>
                                    <span className="text-[10px] font-mono-code block font-bold mt-0.5" style={{ color: currentTheme.primary }}>
                                        Área Total: {currentEst.areaHa} ha
                                    </span>
                                </div>
                            </div>

                            {/* Detalhes de Equipe & Frota */}
                            <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentTheme.border }}>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-400">Operador:</span>
                                    <span className="font-semibold" style={{ color: currentTheme.textPrimary }}>{currentOperator.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-400">Equipamento:</span>
                                    <span className="font-mono-code" style={{ color: currentTheme.textPrimary }}>{currentEq.code}</span>
                                </div>
                            </div>

                            {/* Card de Custo Estimado & Precificação */}
                            <div
                                className="p-3.5 rounded-xl border text-center"
                                style={{
                                    backgroundColor: currentTheme.badgeSuccess.bg,
                                    borderColor: currentTheme.badgeSuccess.border,
                                }}
                            >
                                <span className="text-[10px] uppercase font-semibold block tracking-wider" style={{ color: currentTheme.primary }}>
                                    Custo Total Estimado
                                </span>
                                <span className="text-xl font-bold font-jakarta font-mono-code mt-1 block" style={{ color: currentTheme.primary }}>
                                    {formatCurrency(totalCalculatedCost)}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono-code mt-0.5 block">
                                    Modelo: {pricingModel === 'hectare' ? `R$ ${unitPriceInput}/ha x ${currentEst.areaHa}ha` : pricingModel === 'hora' ? `R$ ${unitPriceInput}/h` : 'Valor Fixo'}
                                </span>
                            </div>
                        </div>

                        {/* Validação de Segurança */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-mono-code" style={{ color: currentTheme.primary }}>
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                <span>RTK & Rádio VHF Checados</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Rodapé de Ações */}
                <footer
                    className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t transition-colors"
                    style={{
                        backgroundColor: currentTheme.surfaceSecondary,
                        borderColor: currentTheme.border,
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (step > 1) setStep((step - 1) as StepType);
                            else onClose();
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:opacity-80"
                        style={{
                            backgroundColor: currentTheme.surface,
                            borderColor: currentTheme.border,
                            color: currentTheme.textPrimary,
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{step === 1 ? 'Voltar para o Painel' : 'Passo Anterior'}</span>
                    </button>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:opacity-80"
                            style={{
                                backgroundColor: currentTheme.surface,
                                borderColor: currentTheme.border,
                                color: currentTheme.textSecondary,
                            }}
                        >
                            Salvar Rascunho
                        </button>

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep((step + 1) as StepType)}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-md hover:opacity-90"
                                style={{ backgroundColor: currentTheme.primary }}
                            >
                                <span>Próximo Passo</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleConfirmSubmit}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-lg disabled:opacity-50 hover:opacity-90"
                                style={{ backgroundColor: currentTheme.primary }}
                            >
                                <CheckSquare className="w-4 h-4" />
                                <span>{isSubmitting ? 'Despachando...' : 'Confirmar & Iniciar O.S.'}</span>
                            </button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};
