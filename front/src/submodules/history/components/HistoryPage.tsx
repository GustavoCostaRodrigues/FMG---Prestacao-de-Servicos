import React, { useState, useMemo } from 'react';
import { colors, type ThemeMode } from '../../../styles/theme';
import {
    Search, Download, Eye, Printer, CheckCircle2, Clock,
    FileText, Building2, RotateCcw, XCircle
} from 'lucide-react';
import type { HistoryOrder } from './history.types';
import { ReportExportModal } from '../../modals/reportModal/ReportExportModal';
import { OrderServiceModal } from '../../modals/osModal/OrderServiceModal';

interface HistoryPageProps {
    themeMode?: ThemeMode;
}

const MOCK_HISTORY_ORDERS: HistoryOrder[] = [
    {
        id: '1',
        code: '#2024-8841',
        date: '24/10/2024, 14:32',
        operationName: 'Colheita de Milho Safrinha',
        plotDetails: 'Talhão 07 • Gleba Norte (142 ha)',
        clientName: 'Agropecuária Santa Fé S.A.',
        operatorName: 'Carlos Mendes',
        equipment: 'John Deere S770 (COLH-02)',
        formattedHours: '42h 15m',
        cost: 1605.66,
        status: 'concluida',
    },
    {
        id: '2',
        code: '#2024-8835',
        date: '21/10/2024, 08:00',
        operationName: 'Pulverização Preventiva Fúngica',
        plotDetails: 'Talhão 12 • Setor Oeste (90 ha)',
        clientName: 'Cooperativa Vale Verde',
        operatorName: 'Marcos Silva',
        equipment: 'Patriot 350 (PULV-04)',
        formattedHours: '00h 00m',
        cost: 0,
        status: 'cancelada',
    },
    {
        id: '3',
        code: '#2024-8829',
        date: '18/10/2024, 11:15',
        operationName: 'Preparação de Solo & Calagem',
        plotDetails: 'Talhão 04 • Gleba Sul (210 ha)',
        clientName: 'Fazenda Morro Grande (Própria)',
        operatorName: 'Lucas Guedes',
        equipment: 'Case Magnum 340 (TRAT-09)',
        formattedHours: '18h 30m',
        cost: 2450.00,
        status: 'concluida',
    },
    {
        id: '4',
        code: '#2024-8822',
        date: '15/10/2024, 16:45',
        operationName: 'Semeadura de Milho Safrinha',
        plotDetails: 'Talhão 09 • Gleba Leste (165 ha)',
        clientName: 'Agropecuária Santa Fé S.A.',
        operatorName: 'Rodrigo Morais',
        equipment: 'Valtra T250 (TRAT-14)',
        formattedHours: '36h 40m',
        cost: 4120.50,
        status: 'concluida',
    },
    {
        id: '5',
        code: '#2024-8818',
        date: '12/10/2024, 09:20',
        operationName: 'Adubação de Cobertura Foliar',
        plotDetails: 'Talhão 01 • Setor Central (110 ha)',
        clientName: 'Cooperativa Vale Verde',
        operatorName: 'Marcos Silva',
        equipment: 'Patriot 350 (PULV-04)',
        formattedHours: '14h 10m',
        cost: 1890.00,
        status: 'concluida',
    },
    {
        id: '6',
        code: '#2024-8810',
        date: '08/10/2024, 07:30',
        operationName: 'Dessecação Pré-Emergente',
        plotDetails: 'Talhão 03 • Gleba Norte (135 ha)',
        clientName: 'Fazenda Morro Grande (Própria)',
        operatorName: 'Carlos Mendes',
        equipment: 'Patriot 350 (PULV-04)',
        formattedHours: '00h 00m',
        cost: 0,
        status: 'cancelada',
    },
    {
        id: '7',
        code: '#2024-8804',
        date: '04/10/2024, 13:00',
        operationName: 'Subsolagem Profunda 45cm',
        plotDetails: 'Talhão 15 • Setor Sul (88 ha)',
        clientName: 'Agropecuária Santa Fé S.A.',
        operatorName: 'Lucas Guedes',
        equipment: 'Case Magnum 340 (TRAT-09)',
        formattedHours: '28h 50m',
        cost: 3280.75,
        status: 'concluida',
    },
    {
        id: '8',
        code: '#2024-8798',
        date: '01/10/2024, 10:10',
        operationName: 'Gradagem Intermediária',
        plotDetails: 'Talhão 08 • Gleba Oeste (175 ha)',
        clientName: 'Cooperativa Vale Verde',
        operatorName: 'Rodrigo Morais',
        equipment: 'Valtra T250 (TRAT-14)',
        formattedHours: '22h 15m',
        cost: 2710.00,
        status: 'concluida',
    }
];

export const HistoryPage: React.FC<HistoryPageProps> = ({ themeMode = 'dark' }) => {
    const currentTheme = colors[themeMode || 'dark'];
    const isDark = themeMode === 'dark';

    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [periodFilter, setPeriodFilter] = useState<string>('safra2425');
    const [clientFilter, setClientFilter] = useState<string>('all');
    const [equipmentFilter, setEquipmentFilter] = useState<string>('all');

    // Modals
    const [activeOsModalCode, setActiveOsModalCode] = useState<string | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // Dropdown lists
    const clientsList = ['Agropecuária Santa Fé S.A.', 'Cooperativa Vale Verde', 'Fazenda Morro Grande (Própria)'];
    const equipmentList = ['John Deere S770', 'Case Magnum 340', 'Patriot 350', 'Valtra T250'];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    // Filter logic
    const filteredOrders = useMemo(() => {
        return MOCK_HISTORY_ORDERS.filter((order) => {
            const matchesSearch =
                order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.operationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.plotDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.equipment.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const matchesClient = clientFilter === 'all' || order.clientName === clientFilter;
            const matchesEquipment = equipmentFilter === 'all' || order.equipment.includes(equipmentFilter);

            return matchesSearch && matchesStatus && matchesClient && matchesEquipment;
        });
    }, [searchTerm, statusFilter, clientFilter, equipmentFilter]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPeriodFilter('safra2425');
        setClientFilter('all');
        setEquipmentFilter('all');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 font-inter">
            {/* 1. Breadcrumb + Cabeçalho da Página & Botões de Ação */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <span>Operações de Campo</span>
                    <span>/</span>
                    <span className="text-emerald-500 font-semibold">
                        Auditoria & Histórico • Ciclo 2024/2025
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                            Histórico de Ordens de Serviço
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold font-mono-code border ${isDark
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}>
                            136 O.S. AUDITADAS
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsExportModalOpen(true)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${isDark
                                    ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200'
                                    : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                                }`}
                        >
                            <Download className="w-4 h-4 text-neutral-400" />
                            <span>Gerar Relatório</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Cards de Métricas e KPIs Rápidos (Grid 4 Colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Total Auditadas */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Total Encerradas
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                136
                            </span>
                            <span className="text-xs font-semibold text-emerald-500 font-mono-code">
                                Safra 24/25
                            </span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark
                            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/30'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        <FileText className="w-5 h-5" />
                    </div>
                </div>

                {/* KPI 2: Concluídas com Sucesso */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Concluídas com Sucesso
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-emerald-500">
                                128
                            </span>
                            <span className="text-xs text-neutral-400 font-semibold font-mono-code">
                                94.1% Eficiência
                            </span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark
                            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/30'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                </div>

                {/* KPI 3: Canceladas / Interrompidas */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Canceladas / Interrompidas
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-rose-500">
                                8
                            </span>
                            <span className="text-xs text-rose-500 font-semibold font-mono-code">
                                Interrupções
                            </span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark
                            ? 'bg-rose-950/50 text-rose-400 border-rose-800/30'
                            : 'bg-rose-100 text-rose-700 border-rose-200'
                        }`}>
                        <XCircle className="w-5 h-5" />
                    </div>
                </div>

                {/* KPI 4: Total de Horas Apontadas */}
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
                            Total Apontamento HH
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-blue-400">
                                1.840h
                            </span>
                            <span className="text-xs text-neutral-400 font-mono-code">
                                Em operação
                            </span>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-950/50 text-blue-400 border border-blue-800/30">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* 3. Barra de Busca e Filtros Dinâmicos */}
            <div
                className="p-4 rounded-2xl border shadow-2xs space-y-4 transition-colors relative z-20"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    {/* Busca Global com Command Shortcut ⌘K */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por código #2024, talhão, operador, equipamento ou cliente..."
                            className={`w-full pl-10 pr-12 py-2 rounded-xl text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-[#2d7044]/40 ${isDark
                                    ? 'bg-neutral-900/80 border-neutral-700 text-white placeholder-neutral-500'
                                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                                }`}
                        />
                    </div>

                    {/* Dropdowns Avançados */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Period Filter */}
                        <div className="relative">
                            <select
                                value={periodFilter}
                                onChange={(e) => setPeriodFilter(e.target.value)}
                                className={`px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none ${isDark
                                        ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800'
                                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <option value="safra2425">Período: Safra 2024/2025</option>
                                <option value="30d">Período: Últimos 30 dias</option>
                                <option value="90d">Período: Últimos 90 dias</option>
                            </select>
                        </div>

                        {/* Clientes */}
                        <div className="relative">
                            <select
                                value={clientFilter}
                                onChange={(e) => setClientFilter(e.target.value)}
                                className={`px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none ${isDark
                                        ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800'
                                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <option value="all">Cliente: Todos</option>
                                {clientsList.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Equipamentos */}
                        <div className="relative">
                            <select
                                value={equipmentFilter}
                                onChange={(e) => setEquipmentFilter(e.target.value)}
                                className={`px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none ${isDark
                                        ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800'
                                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <option value="all">Máquinas: Todas</option>
                                {equipmentList.map((eq) => (
                                    <option key={eq} value={eq}>{eq}</option>
                                ))}
                            </select>
                        </div>

                        {/* Botão de Limpar Filtros */}
                        {(searchTerm || statusFilter !== 'all' || periodFilter !== 'safra2425' || clientFilter !== 'all' || equipmentFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${isDark
                                        ? 'bg-neutral-800/80 border-neutral-700 text-rose-400 hover:bg-neutral-700'
                                        : 'bg-neutral-100 border-neutral-200 text-rose-600 hover:bg-neutral-200'
                                    }`}
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
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'all'
                                ? 'bg-[#2d7044] text-white shadow-2xs'
                                : isDark
                                    ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        Todas as O.S. (136)
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('concluida')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'concluida'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : isDark
                                    ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5" />
                        Concluídas (128)
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('cancelada')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'cancelada'
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : isDark
                                    ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-rose-400 inline-block mr-1.5" />
                        Canceladas (8)
                    </button>
                </div>
            </div>

            {/* 4. Tabela de Ordens de Serviço Auditadas (Desktop) & Cards (Mobile) */}
            <div
                className="rounded-2xl border shadow-2xs transition-colors overflow-hidden"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                {/* Tabela Desktop (md:block) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr
                                className="border-b text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-jakarta"
                                style={{
                                    borderColor: currentTheme.border,
                                    backgroundColor: isDark ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 0.8)',
                                }}
                            >
                                <th className="py-3.5 px-4">Identificador & Data</th>
                                <th className="py-3.5 px-4">Operação & Talhão</th>
                                <th className="py-3.5 px-4">Cliente / Contratante</th>
                                <th className="py-3.5 px-4">Responsável & Equipamento</th>
                                <th className="py-3.5 px-4 text-right">Apontamento HH & Custo</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4 text-right">Ações Rápidas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs italic">
                                        Nenhuma Ordem de Serviço encontrada no histórico com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const isCompleted = order.status === 'concluida';

                                    return (
                                        <tr
                                            key={order.id}
                                            className={`transition-colors hover:bg-neutral-800/30 ${!isCompleted ? 'bg-rose-950/10' : ''
                                                }`}
                                        >
                                            {/* Coluna 1: Identificador & Data */}
                                            <td className="py-3.5 px-4 align-top">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveOsModalCode(`OS ${order.code}`)}
                                                    className={`font-mono-code text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${isCompleted ? 'text-emerald-400 hover:text-emerald-300' : 'text-rose-400 hover:text-rose-300'
                                                        }`}
                                                >
                                                    <span>{order.code}</span>
                                                </button>
                                                <span className="text-[10px] text-neutral-400 font-mono-code mt-1 block">
                                                    {order.date}
                                                </span>
                                            </td>

                                            {/* Coluna 2: Operação & Talhão */}
                                            <td className="py-3.5 px-4 align-top">
                                                <h4 className="text-xs font-semibold tracking-tight" style={{ color: currentTheme.textPrimary }}>
                                                    {order.operationName}
                                                </h4>
                                                <span className="text-xs text-neutral-400 font-medium block mt-0.5">
                                                    {order.plotDetails}
                                                </span>
                                            </td>

                                            {/* Coluna 3: Contratante / Cliente */}
                                            <td className="py-3.5 px-4 align-top">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                                    <span className="text-xs font-medium truncate" style={{ color: currentTheme.textPrimary }}>
                                                        {order.clientName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Coluna 4: Responsável & Equipamento */}
                                            <td className="py-3.5 px-4 align-top">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-[#2d7044]/30 border border-[#2d7044]/50 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 font-mono-code">
                                                        {getInitials(order.operatorName)}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold block leading-tight" style={{ color: currentTheme.textPrimary }}>
                                                            {order.operatorName}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400 font-mono-code block mt-0.5">
                                                            {order.equipment}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Coluna 5: Apontamento HH & Custo */}
                                            <td className="py-3.5 px-4 align-top text-right font-mono-code">
                                                <span className="text-xs font-semibold block" style={{ color: currentTheme.textPrimary }}>
                                                    {order.formattedHours}
                                                </span>
                                                <span className={`text-[11px] font-medium block mt-0.5 ${isCompleted ? 'text-emerald-400' : 'text-neutral-500'}`}>
                                                    {isCompleted ? formatCurrency(order.cost) : 'Cancelada'}
                                                </span>
                                            </td>

                                            {/* Coluna 6: Status */}
                                            <td className="py-3.5 px-4 align-top text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${isCompleted
                                                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                                                            : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                    {isCompleted ? 'Concluída' : 'Cancelada'}
                                                </span>
                                            </td>

                                            {/* Coluna 7: Ações Rápidas */}
                                            <td className="py-3.5 px-4 align-top text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveOsModalCode(`OS ${order.code}`)}
                                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${isDark
                                                                ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
                                                                : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700'
                                                            }`}
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                                                        <span>Detalhes</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Imprimir O.S."
                                                        onClick={() => alert(`Imprimindo relatório auditado da ${order.code}`)}
                                                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isDark
                                                                ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300 hover:text-white'
                                                                : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                                                            }`}
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
                    {filteredOrders.map((order) => {
                        const isCompleted = order.status === 'concluida';
                        return (
                            <div key={order.id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setActiveOsModalCode(`OS ${order.code}`)}
                                        className={`font-mono-code text-xs font-bold ${isCompleted ? 'text-emerald-400' : 'text-rose-400'
                                            }`}
                                    >
                                        {order.code}
                                    </button>
                                    <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${isCompleted
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                            }`}
                                    >
                                        {isCompleted ? 'Concluída' : 'Cancelada'}
                                    </span>
                                </div>
                                <h4 className="text-xs font-semibold">{order.operationName}</h4>
                                <p className="text-xs text-neutral-400">{order.plotDetails} • {order.operatorName}</p>
                                <div className="flex items-center justify-between text-xs font-mono-code text-neutral-400">
                                    <span>{order.date}</span>
                                    <span className="text-emerald-400 font-bold">{order.formattedHours}</span>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setActiveOsModalCode(`OS ${order.code}`)}
                                        className="flex-1 py-2 bg-neutral-800 text-xs font-medium rounded-xl text-center text-white"
                                    >
                                        Ver Detalhes
                                    </button>
                                    <button
                                        type="button"
                                        title="Imprimir O.S."
                                        onClick={() => alert(`Imprimindo relatório auditado da ${order.code}`)}
                                        className="p-2 bg-neutral-800 text-xs font-medium rounded-xl text-center text-neutral-300 hover:text-white cursor-pointer"
                                    >
                                        <Printer className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Rodapé da Tabela & Paginação */}
                <div
                    className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors font-mono-code"
                    style={{ borderColor: currentTheme.border }}
                >
                    <span className="text-neutral-400">
                        Exibindo <strong className="text-emerald-400">{filteredOrders.length}</strong> de <strong>136</strong> Ordens de Serviço auditadas
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`px-3 py-1.5 rounded-xl border text-neutral-500 cursor-not-allowed opacity-50 ${isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'
                                }`}
                        >
                            Anterior
                        </button>
                        <span className="px-3 py-1.5 rounded-xl bg-[#2d7044] text-white font-semibold text-xs">
                            Pág. 1 de 17
                        </span>
                        <button
                            type="button"
                            className={`px-3 py-1.5 rounded-xl border text-neutral-300 hover:text-emerald-400 hover:border-emerald-800/60 cursor-pointer transition-colors ${isDark ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-white'
                                }`}
                        >
                            Próxima
                        </button>
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

            {isExportModalOpen && (
                <ReportExportModal
                    themeMode={themeMode}
                    onClose={() => setIsExportModalOpen(false)}
                    onSuccessExport={() => alert('Relatório PDF do Histórico exportado com sucesso!')}
                />
            )}
        </div>
    );
};