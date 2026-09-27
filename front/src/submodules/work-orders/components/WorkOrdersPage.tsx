import React, { useState, useMemo } from 'react';
import {
    Search, Download, Plus, Eye, Printer,
    CheckCircle2, Clock, AlertTriangle, FileText, Activity,
    Building2, RotateCcw
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import { OrderServiceModal } from '../../modals/osModal/OrderServiceModal';
import { ReportExportModal } from '../../modals/reportModal/ReportExportModal';
import { NewOrderModal } from '../../modals/newOrderModal/NewOrderModal';

export interface WorkOrderItem {
    id: string;
    code: string;
    shift: string;
    operationName: string;
    plotDetails: string;
    areaHa: number;
    clientName: string;
    operatorName: string;
    operatorRole: string;
    equipmentName: string;
    equipmentCode: string;
    status: 'em_andamento' | 'agendada' | 'concluida' | 'conflito';
    elapsedHours: string;
    estimatedHours: string;
}

export interface WorkOrdersPageProps {
    themeMode?: ThemeMode;
    onNewWorkOrder?: () => void;
}

const INITIAL_WORK_ORDERS: WorkOrderItem[] = [
    {
        id: '1',
        code: '#2024-8839',
        shift: 'Manhã (06h - 12h)',
        operationName: 'Preparação de Solo & Descompactação',
        plotDetails: 'Talhão 14 • Gleba Sul',
        areaHa: 142,
        clientName: 'Agropecuária Santa Fé S.A.',
        operatorName: 'Marcos Silva',
        operatorRole: 'Operador Sênior',
        equipmentName: 'Case Magnum 340',
        equipmentCode: 'TRAT-09',
        status: 'em_andamento',
        elapsedHours: '06h 45m',
        estimatedHours: '08h 00m',
    },
    {
        id: '2',
        code: '#2024-8840',
        shift: 'Manhã (06h - 12h)',
        operationName: 'Pulverização de Defensivos Agrícolas',
        plotDetails: 'Talhão 02 • Gleba Norte',
        areaHa: 98,
        clientName: 'Cooperativa Vale Verde',
        operatorName: 'Rodrigo Morais',
        operatorRole: 'Técnico em Aplicação',
        equipmentName: 'Patriot 350',
        equipmentCode: 'PULV-04',
        status: 'concluida',
        elapsedHours: '04h 30m',
        estimatedHours: '04h 30m',
    },
    {
        id: '3',
        code: '#2024-8841',
        shift: 'Manhã / Tarde',
        operationName: 'Colheita de Milho Safrinha',
        plotDetails: 'Talhão 07 • Setor Central',
        areaHa: 215,
        clientName: 'Fazenda Morro Grande (Própria)',
        operatorName: 'Carlos Mendes',
        operatorRole: 'Operador Especialista',
        equipmentName: 'John Deere S770',
        equipmentCode: 'COLH-02',
        status: 'em_andamento',
        elapsedHours: '05h 15m',
        estimatedHours: '10h 00m',
    },
    {
        id: '4',
        code: '#2024-8845',
        shift: 'Tarde (13h - 18h)',
        operationName: 'Semeadura de Soja Safra Principal',
        plotDetails: 'Talhão 03 • Gleba Leste',
        areaHa: 160,
        clientName: 'Agropecuária Santa Fé S.A.',
        operatorName: 'Lucas Guedes',
        operatorRole: 'Operador Pleno',
        equipmentName: 'Valtra T250',
        equipmentCode: 'TRAT-14',
        status: 'agendada',
        elapsedHours: '00h 00m',
        estimatedHours: '06h 30m',
    },
    {
        id: '5',
        code: '#2024-8849',
        shift: 'Tarde (13h - 18h)',
        operationName: 'Calagem & Incorporação Sede',
        plotDetails: 'Talhão 09 • Gleba Oeste',
        areaHa: 85,
        clientName: 'Cooperativa Vale Verde',
        operatorName: 'Marcos Silva',
        operatorRole: 'Operador Sênior',
        equipmentName: 'Case Magnum 340',
        equipmentCode: 'TRAT-09',
        status: 'conflito',
        elapsedHours: '00h 00m',
        estimatedHours: '05h 00m',
    },
    {
        id: '6',
        code: '#2024-8854',
        shift: 'Manhã (06h - 12h)',
        operationName: 'Manutenção Preventiva de Frota',
        plotDetails: 'Oficina Central • Sede',
        areaHa: 0,
        clientName: 'Fazenda Morro Grande (Própria)',
        operatorName: 'Equipe de Mecânica',
        operatorRole: 'Oficina Mecânica',
        equipmentName: 'Oficina Central',
        equipmentCode: 'MANUT-01',
        status: 'agendada',
        elapsedHours: '01h 00m',
        estimatedHours: '04h 00m',
    },
    {
        id: '7',
        code: '#2024-8860',
        shift: 'Noite (19h - 02h)',
        operationName: 'Plantio de Cobertura Vegetal',
        plotDetails: 'Talhão 08 • Setor Sul',
        areaHa: 110,
        clientName: 'Agropecuária Santa Fé S.A.',
        operatorName: 'Lucas Guedes',
        operatorRole: 'Operador Pleno',
        equipmentName: 'Valtra T250',
        equipmentCode: 'TRAT-14',
        status: 'agendada',
        elapsedHours: '00h 00m',
        estimatedHours: '07h 00m',
    },
    {
        id: '8',
        code: '#2024-8866',
        shift: 'Manhã (06h - 12h)',
        operationName: 'Dessecação Pré-Emergente',
        plotDetails: 'Talhão 11 • Gleba Norte',
        areaHa: 135,
        clientName: 'Cooperativa Vale Verde',
        operatorName: 'Rodrigo Morais',
        operatorRole: 'Técnico em Aplicação',
        equipmentName: 'Patriot 350',
        equipmentCode: 'PULV-04',
        status: 'concluida',
        elapsedHours: '05h 15m',
        estimatedHours: '05h 15m',
    }
];

export const WorkOrdersPage: React.FC<WorkOrdersPageProps> = ({
    themeMode = 'dark',
    onNewWorkOrder,
}) => {
    const currentTheme = colors[themeMode || 'dark'];

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedMachine, setSelectedMachine] = useState<string>('all');
    const [selectedOperator, setSelectedOperator] = useState<string>('all');
    const [selectedClient, setSelectedClient] = useState<string>('all');

    // Modals
    const [activeOsModalCode, setActiveOsModalCode] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

    // Dropdowns
    const machinesList = ['Case Magnum 340', 'John Deere S770', 'Patriot 350', 'Valtra T250', 'Oficina Central'];
    const operatorsList = ['Marcos Silva', 'Rodrigo Morais', 'Carlos Mendes', 'Lucas Guedes', 'Equipe de Mecânica'];
    const clientsList = ['Agropecuária Santa Fé S.A.', 'Cooperativa Vale Verde', 'Fazenda Morro Grande (Própria)'];

    // Filter logic
    const filteredOrders = useMemo(() => {
        return INITIAL_WORK_ORDERS.filter((item) => {
            const matchesSearch =
                item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.operationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.plotDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.clientName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            const matchesMachine = selectedMachine === 'all' || item.equipmentName === selectedMachine;
            const matchesOperator = selectedOperator === 'all' || item.operatorName === selectedOperator;
            const matchesClient = selectedClient === 'all' || item.clientName === selectedClient;

            return matchesSearch && matchesStatus && matchesMachine && matchesOperator && matchesClient;
        });
    }, [searchQuery, statusFilter, selectedMachine, selectedOperator, selectedClient]);

    const activeOrdersCount = INITIAL_WORK_ORDERS.filter(o => o.status === 'em_andamento' || o.status === 'agendada').length;
    const runningOrdersCount = INITIAL_WORK_ORDERS.filter(o => o.status === 'em_andamento').length;
    const scheduledOrdersCount = INITIAL_WORK_ORDERS.filter(o => o.status === 'agendada').length;
    const conflictOrdersCount = INITIAL_WORK_ORDERS.filter(o => o.status === 'conflito').length;

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setSelectedMachine('all');
        setSelectedOperator('all');
        setSelectedClient('all');
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
        <div className="space-y-6 animate-in fade-in duration-300 font-inter">
            {/* 1. Breadcrumb + Cabeçalho da Página & Botões de Ação */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <span>Operações de Campo</span>
                    <span>/</span>
                    <span className="font-semibold" style={{ color: currentTheme.primary }}>
                        Despacho & Acompanhamento
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                            Ordens de Serviço
                        </h1>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-semibold border font-mono-code"
                            style={{
                                backgroundColor: currentTheme.badgeSuccess.bg,
                                color: currentTheme.badgeSuccess.text,
                                borderColor: currentTheme.badgeSuccess.border,
                            }}
                        >
                            FRENTES OPERACIONAIS
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsReportModalOpen(true)}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs"
                            style={{
                                backgroundColor: currentTheme.surfaceSecondary,
                                borderColor: currentTheme.border,
                                color: currentTheme.textPrimary,
                            }}
                        >
                            <Download className="w-4 h-4 text-neutral-400" />
                            <span>Gerar Relatório</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                if (onNewWorkOrder) onNewWorkOrder();
                                setIsNewOrderModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-md hover:shadow-lg"
                            style={{ backgroundColor: currentTheme.primary }}
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nova O.S.</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Cards de Métricas e KPIs Rápidos (Grid 4 Colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Ordens Ativas */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Ordens Ativas
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                {activeOrdersCount}
                            </span>
                            <span className="text-xs font-semibold font-mono-code" style={{ color: currentTheme.primary }}>
                                O.S. em campo
                            </span>
                        </div>
                    </div>
                    <div
                        className="p-3 rounded-xl border"
                        style={{
                            backgroundColor: currentTheme.iconBoxSuccess.bg,
                            color: currentTheme.iconBoxSuccess.text,
                            borderColor: currentTheme.iconBoxSuccess.border,
                        }}
                    >
                        <FileText className="w-5 h-5" />
                    </div>
                </div>

                {/* KPI 2: Em Andamento */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Em Andamento
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-amber-500">
                                {runningOrdersCount}
                            </span>
                            <span className="text-xs text-neutral-400 font-semibold font-mono-code">
                                Frentes ativas
                            </span>
                        </div>
                    </div>
                    <div
                        className="p-3 rounded-xl border"
                        style={{
                            backgroundColor: currentTheme.iconBoxWarning.bg,
                            color: currentTheme.iconBoxWarning.text,
                            borderColor: currentTheme.iconBoxWarning.border,
                        }}
                    >
                        <Activity className="w-5 h-5" />
                    </div>
                </div>

                {/* KPI 3: Agendadas */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Agendadas (48h)
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-blue-500">
                                {scheduledOrdersCount}
                            </span>
                            <span className="text-xs text-neutral-400">Próximos turnos</span>
                        </div>
                    </div>
                    <div
                        className="p-3 rounded-xl border"
                        style={{
                            backgroundColor: currentTheme.iconBoxInfo.bg,
                            color: currentTheme.iconBoxInfo.text,
                            borderColor: currentTheme.iconBoxInfo.border,
                        }}
                    >
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                {/* KPI 4: Conflitos de Frota */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Conflitos de Escala
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span
                                className="text-2xl font-bold font-jakarta"
                                style={{ color: conflictOrdersCount > 0 ? currentTheme.error : currentTheme.primary }}
                            >
                                {conflictOrdersCount}
                            </span>
                            <span
                                className="text-xs font-semibold"
                                style={{ color: conflictOrdersCount > 0 ? currentTheme.error : currentTheme.primary }}
                            >
                                {conflictOrdersCount > 0 ? 'Atenção Necessária' : 'Escala Sincronizada'}
                            </span>
                        </div>
                    </div>
                    <div
                        className="p-3 rounded-xl border"
                        style={{
                            backgroundColor: conflictOrdersCount > 0 ? currentTheme.iconBoxDanger.bg : currentTheme.iconBoxSuccess.bg,
                            color: conflictOrdersCount > 0 ? currentTheme.iconBoxDanger.text : currentTheme.iconBoxSuccess.text,
                            borderColor: conflictOrdersCount > 0 ? currentTheme.iconBoxDanger.border : currentTheme.iconBoxSuccess.border,
                        }}
                    >
                        {conflictOrdersCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    </div>
                </div>
            </div>

            {/* 3. Barra de Busca e Filtros Dinâmicos */}
            <div
                className="p-4 rounded-2xl border shadow-2xs space-y-4 transition-colors relative z-20"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    {/* Busca Global */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por código, operador, maquinário ou cliente..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border transition-all focus:outline-none"
                            style={{
                                backgroundColor: currentTheme.inputBg,
                                borderColor: currentTheme.inputBorder,
                                color: currentTheme.inputText,
                            }}
                        />
                    </div>

                    {/* Dropdowns Avançados */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Máquinas */}
                        <div className="relative">
                            <select
                                value={selectedMachine}
                                onChange={(e) => setSelectedMachine(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none"
                                style={{
                                    backgroundColor: currentTheme.dropdownBg,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                }}
                            >
                                <option value="all">Máquinas: Todas</option>
                                {machinesList.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* Colaboradores */}
                        <div className="relative">
                            <select
                                value={selectedOperator}
                                onChange={(e) => setSelectedOperator(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none"
                                style={{
                                    backgroundColor: currentTheme.dropdownBg,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                }}
                            >
                                <option value="all">Operador: Todos</option>
                                {operatorsList.map((op) => (
                                    <option key={op} value={op}>{op}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clientes */}
                        <div className="relative">
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none"
                                style={{
                                    backgroundColor: currentTheme.dropdownBg,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                }}
                            >
                                <option value="all">Cliente: Todos</option>
                                {clientsList.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Botão de Limpar Filtros */}
                        {(searchQuery || statusFilter !== 'all' || selectedMachine !== 'all' || selectedOperator !== 'all' || selectedClient !== 'all') && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer"
                                style={{
                                    backgroundColor: currentTheme.surfaceSecondary,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.error,
                                }}
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Limpar</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Pills de Status Rápidos */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t pt-3" style={{ borderColor: currentTheme.border }}>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border"
                        style={{
                            backgroundColor: statusFilter === 'all' ? currentTheme.primary : currentTheme.surfaceSecondary,
                            color: statusFilter === 'all' ? '#FFFFFF' : currentTheme.textSecondary,
                            borderColor: statusFilter === 'all' ? currentTheme.primary : currentTheme.border,
                        }}
                    >
                        Todas as O.S. ({INITIAL_WORK_ORDERS.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('em_andamento')}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border"
                        style={{
                            backgroundColor: statusFilter === 'em_andamento' ? currentTheme.warning : currentTheme.surfaceSecondary,
                            color: statusFilter === 'em_andamento' ? '#FFFFFF' : currentTheme.textSecondary,
                            borderColor: statusFilter === 'em_andamento' ? currentTheme.warning : currentTheme.border,
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block mr-1.5" />
                        Em Andamento ({runningOrdersCount})
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('agendada')}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border"
                        style={{
                            backgroundColor: statusFilter === 'agendada' ? currentTheme.info : currentTheme.surfaceSecondary,
                            color: statusFilter === 'agendada' ? '#FFFFFF' : currentTheme.textSecondary,
                            borderColor: statusFilter === 'agendada' ? currentTheme.info : currentTheme.border,
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block mr-1.5" />
                        Agendadas ({scheduledOrdersCount})
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('concluida')}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border"
                        style={{
                            backgroundColor: statusFilter === 'concluida' ? currentTheme.success : currentTheme.surfaceSecondary,
                            color: statusFilter === 'concluida' ? '#FFFFFF' : currentTheme.textSecondary,
                            borderColor: statusFilter === 'concluida' ? currentTheme.success : currentTheme.border,
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5" />
                        Concluídas
                    </button>
                </div>
            </div>

            {/* 4. Tabela de Ordens de Serviço (Desktop) & Cards (Mobile) */}
            <div
                className="rounded-2xl border shadow-2xs transition-colors overflow-hidden"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                {/* Tabela Desktop (md:block) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr
                                className="border-b text-[11px] font-semibold uppercase tracking-wider font-jakarta"
                                style={{
                                    borderColor: currentTheme.border,
                                    backgroundColor: currentTheme.surfaceSecondary,
                                    color: currentTheme.textSecondary,
                                }}
                            >
                                <th className="py-3 px-4">Identificador & Turno</th>
                                <th className="py-3 px-4">Operação & Talhão</th>
                                <th className="py-3 px-4">Cliente / Contratante</th>
                                <th className="py-3 px-4">Responsável & Equipamento</th>
                                <th className="py-3 px-4 text-right">Ações Rápidas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-xs" style={{ color: currentTheme.textSecondary }}>
                                        Nenhuma Ordem de Serviço encontrada com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((item) => {
                                    const isRunning = item.status === 'em_andamento';
                                    const isConflict = item.status === 'conflito';
                                    const isCompleted = item.status === 'concluida';

                                    const badgeStyle = isRunning
                                        ? currentTheme.badgeWarning
                                        : isConflict
                                            ? currentTheme.badgeDanger
                                            : isCompleted
                                                ? currentTheme.badgeSuccess
                                                : currentTheme.badgeInfo;

                                    const statusText = isRunning
                                        ? 'Em Andamento'
                                        : isConflict
                                            ? 'Conflito'
                                            : isCompleted
                                                ? 'Concluída'
                                                : 'Agendada';

                                    return (
                                        <tr
                                            key={item.id}
                                            className="transition-colors border-b"
                                            style={{ borderColor: currentTheme.border }}
                                        >
                                            {/* Coluna 1: Identificador & Turno */}
                                            <td className="py-3.5 px-4 align-top">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveOsModalCode(`OS ${item.code}`)}
                                                    className="font-mono-code text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                                                    style={{ color: currentTheme.primary }}
                                                >
                                                    <span>{item.code}</span>
                                                    {isRunning && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                                                </button>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <span
                                                        className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-code border"
                                                        style={{
                                                            backgroundColor: badgeStyle.bg,
                                                            color: badgeStyle.text,
                                                            borderColor: badgeStyle.border,
                                                        }}
                                                    >
                                                        {statusText}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-neutral-400 font-mono-code mt-1 block">
                                                    {item.shift}
                                                </span>
                                            </td>

                                            {/* Coluna 2: Operação & Talhão */}
                                            <td className="py-3.5 px-4 align-top">
                                                <h4 className="text-xs font-semibold tracking-tight" style={{ color: currentTheme.textPrimary }}>
                                                    {item.operationName}
                                                </h4>
                                                <span className="text-xs text-neutral-400 font-medium block mt-0.5">
                                                    {item.plotDetails} {item.areaHa > 0 && `(${item.areaHa} ha)`}
                                                </span>
                                            </td>

                                            {/* Coluna 3: Contratante / Cliente */}
                                            <td className="py-3.5 px-4 align-top">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                    <span className="text-xs font-medium truncate" style={{ color: currentTheme.textPrimary }}>
                                                        {item.clientName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Coluna 4: Responsável & Equipamento */}
                                            <td className="py-3.5 px-4 align-top">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 font-mono-code border"
                                                        style={{
                                                            backgroundColor: currentTheme.badgeSuccess.bg,
                                                            borderColor: currentTheme.badgeSuccess.border,
                                                            color: currentTheme.badgeSuccess.text,
                                                        }}
                                                    >
                                                        {getInitials(item.operatorName)}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold block leading-tight" style={{ color: currentTheme.textPrimary }}>
                                                            {item.operatorName}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400 font-mono-code block mt-0.5">
                                                            {item.equipmentName} ({item.equipmentCode})
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Coluna 5: Ações Rápidas */}
                                            <td className="py-3.5 px-4 align-top text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveOsModalCode(`OS ${item.code}`)}
                                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer hover:opacity-80"
                                                        style={{
                                                            backgroundColor: currentTheme.surfaceSecondary,
                                                            borderColor: currentTheme.border,
                                                            color: currentTheme.textPrimary,
                                                        }}
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                                                        <span>Detalhes</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Imprimir O.S."
                                                        onClick={() => alert(`Imprimindo folha de campo da ${item.code}`)}
                                                        className="p-1.5 rounded-lg border transition-colors cursor-pointer hover:opacity-80"
                                                        style={{
                                                            backgroundColor: currentTheme.surfaceSecondary,
                                                            borderColor: currentTheme.border,
                                                            color: currentTheme.textPrimary,
                                                        }}
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Cards Mobile (md:hidden) */}
                <div className="md:hidden divide-y" style={{ borderColor: currentTheme.border }}>
                    {filteredOrders.map((item) => {
                        const isRunning = item.status === 'em_andamento';
                        const isConflict = item.status === 'conflito';
                        const isCompleted = item.status === 'concluida';

                        const badgeStyle = isRunning
                            ? currentTheme.badgeWarning
                            : isConflict
                                ? currentTheme.badgeDanger
                                : isCompleted
                                    ? currentTheme.badgeSuccess
                                    : currentTheme.badgeInfo;

                        const statusText = isRunning
                            ? 'Em Andamento'
                            : isConflict
                                ? 'Conflito'
                                : isCompleted
                                    ? 'Concluída'
                                    : 'Agendada';

                        return (
                            <div key={item.id} className="p-4 space-y-3 border-b" style={{ borderColor: currentTheme.border }}>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveOsModalCode(`OS ${item.code}`)}
                                        className="font-mono-code text-xs font-bold hover:opacity-80"
                                        style={{ color: currentTheme.primary }}
                                    >
                                        {item.code}
                                    </button>
                                    <span
                                        className="px-2 py-0.5 rounded text-[10px] font-bold border font-mono-code"
                                        style={{
                                            backgroundColor: badgeStyle.bg,
                                            color: badgeStyle.text,
                                            borderColor: badgeStyle.border,
                                        }}
                                    >
                                        {statusText}
                                    </span>
                                </div>
                                <h4 className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>{item.operationName}</h4>
                                <p className="text-xs text-neutral-400">{item.plotDetails} • {item.operatorName}</p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveOsModalCode(`OS ${item.code}`)}
                                        className="flex-1 py-2 border text-xs font-medium rounded-xl text-center cursor-pointer hover:opacity-80 transition-colors"
                                        style={{
                                            backgroundColor: currentTheme.surfaceSecondary,
                                            borderColor: currentTheme.border,
                                            color: currentTheme.textPrimary,
                                        }}
                                    >
                                        Ver Detalhes
                                    </button>
                                    <button
                                        type="button"
                                        title="Imprimir O.S."
                                        onClick={() => alert(`Imprimindo folha de campo da ${item.code}`)}
                                        className="p-2 border text-xs font-medium rounded-xl text-center cursor-pointer hover:opacity-80 transition-colors"
                                        style={{
                                            backgroundColor: currentTheme.surfaceSecondary,
                                            borderColor: currentTheme.border,
                                            color: currentTheme.textPrimary,
                                        }}
                                    >
                                        <Printer className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Rodapé da Tabela */}
                <div
                    className="p-3 border-t flex items-center justify-between flex-wrap gap-2 text-xs text-neutral-400 font-mono-code"
                    style={{ borderColor: currentTheme.border }}
                >
                    <div className="flex items-center gap-2">
                        <span>Exibindo {filteredOrders.length} de {INITIAL_WORK_ORDERS.length} Ordens de Serviço</span>
                    </div>
                </div>
            </div>

            {/* Modais Globais */}
            {activeOsModalCode && (
                <OrderServiceModal
                    osCode={activeOsModalCode}
                    themeMode={themeMode}
                    onClose={() => setActiveOsModalCode(null)}
                    onComplete={() => alert('Ordem de Serviço finalizada!')}
                />
            )}

            {isReportModalOpen && (
                <ReportExportModal
                    themeMode={themeMode}
                    onClose={() => setIsReportModalOpen(false)}
                    onSuccessExport={() => alert('Relatório das O.S. exportado com sucesso!')}
                />
            )}

            {isNewOrderModalOpen && (
                <NewOrderModal
                    themeMode={themeMode}
                    onClose={() => setIsNewOrderModalOpen(false)}
                    onSuccessCreate={(newOrder) => {
                        alert(`Ordem de Serviço ${newOrder.code} despachada com sucesso!`);
                    }}
                />
            )}
        </div>
    );
};
