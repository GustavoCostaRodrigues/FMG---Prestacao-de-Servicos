import React, { useState } from 'react';
import { colors, type ThemeMode } from '../../../styles/theme';
import {
    Search, ChevronLeft, ChevronRight,
    AlertTriangle, Wrench,
    User, Building2, Plus, ChevronDown, FileText, Clock, Grid, SlidersHorizontal
} from 'lucide-react';
import { OrderServiceModal } from '../../modals/osModal/OrderServiceModal';
import { ReportExportModal } from '../../modals/reportModal/ReportExportModal';

interface AgendaPageProps {
    themeMode?: ThemeMode;
}

interface WorkOrder {
    id: string;
    code: string;
    day: number;
    title: string;
    machine: string;
    operator: string;
    client: string;
    status: 'agendada' | 'em_andamento' | 'concluida' | 'conflito';
}

const INITIAL_ORDERS: WorkOrder[] = [
    { id: '1', code: '#8790', day: 1, title: 'Calagem & Fosfatagem', machine: 'JD 8R', operator: 'Carlos M.', client: 'Vale Verde', status: 'concluida' },
    { id: '2', code: '#8794', day: 2, title: 'Grade Niveladora', machine: 'Case 340', operator: 'Marcos S.', client: 'Santa Fé', status: 'concluida' },
    { id: '3', code: '#8802', day: 4, title: 'Mapeamento Drone', machine: 'DJI Matrice', operator: 'Lucas G.', client: 'Vale Verde', status: 'concluida' },
    { id: '4', code: '#8810', day: 7, title: 'Descompactação Subsolo', machine: 'Case 340', operator: 'Marcos S.', client: 'Santa Fé', status: 'concluida' },
    { id: '5', code: '#8815', day: 9, title: 'Aplicação Fungicida', machine: 'Patriot 350', operator: 'Rodrigo M.', client: 'Vale Verde', status: 'concluida' },
    { id: '6', code: '#8822', day: 11, title: 'Tratos Culturais', machine: 'Valtra T250', operator: 'Lucas G.', client: 'Santa Fé', status: 'concluida' },
    { id: '7', code: '#8830', day: 14, title: 'Revisão Plantadeira', machine: 'Oficina', operator: 'Equipe', client: 'Interno', status: 'concluida' },
    { id: '8', code: '#8835', day: 16, title: 'Semeadura Milheto', machine: 'JD S770', operator: 'Carlos A.', client: 'Vale Verde', status: 'concluida' },
    { id: '9', code: '#8840', day: 21, title: 'Pulverização Defensivos', machine: 'Patriot 350', operator: 'Rodrigo M.', client: 'Vale Verde', status: 'concluida' },
    { id: '10', code: '#8841', day: 22, title: 'Colheita de Milho', machine: 'JD S770', operator: 'Carlos A.', client: 'Vale Verde', status: 'concluida' },
    { id: '11', code: '#8845', day: 23, title: 'Plantio Soja Safra', machine: 'Valtra T250', operator: 'Lucas G.', client: 'Santa Fé', status: 'agendada' },
    { id: '12', code: '#8839', day: 24, title: 'Preparação de Solo', machine: 'Case Magnum 340', operator: 'Marcos S.', client: 'Vale Verde', status: 'em_andamento' },
    { id: '13', code: '#8849', day: 25, title: 'Conflito de Alocação', machine: 'Case Magnum 340', operator: 'Marcos S.', client: 'Vale Verde', status: 'conflito' },
    { id: '14', code: '#8854', day: 26, title: 'Manutenção Preventiva', machine: 'Oficina', operator: 'Mecânicos', client: 'Interno', status: 'agendada' },
    { id: '15', code: '#8860', day: 28, title: 'Plantio Talhão 08', machine: 'Valtra T250', operator: 'Lucas G.', client: 'Santa Fé', status: 'agendada' },
    { id: '16', code: '#8866', day: 30, title: 'Dessecação Pré-Emergente', machine: 'Patriot 350', operator: 'Rodrigo M.', client: 'Vale Verde', status: 'agendada' },
];

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Helper para calcular o mês correspondente a uma semana do ano
const getMonthIndexFromWeek = (week: number, year: number): number => {
    const janFirst = new Date(year, 0, 1);
    const targetDate = new Date(janFirst.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
    return Math.min(11, Math.max(0, targetDate.getMonth()));
};

// Helper para calcular a semana inicial de um mês
const getFirstWeekOfMonth = (monthIndex: number, year: number): number => {
    const firstOfMonth = new Date(year, monthIndex, 1);
    const firstOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((firstOfMonth.getTime() - firstOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(52, Math.floor(dayOfYear / 7) + 1));
};

export const AgendaPage: React.FC<AgendaPageProps> = ({ themeMode = 'dark' }) => {
    const currentTheme = colors[themeMode || 'dark'];
    const isDark = themeMode === 'dark';

    const [currentView, setCurrentView] = useState<'month' | 'week' | 'timeline'>('month');
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(9); // Outubro
    const [selectedWeek, setSelectedWeek] = useState<number>(43); // 43ª Semana
    const [activeOsCode, setActiveOsCode] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Handlers sincronizados
    const handleMonthChange = (newMonthIndex: number) => {
        const validMonth = newMonthIndex < 0 ? 11 : newMonthIndex > 11 ? 0 : newMonthIndex;
        setSelectedMonthIndex(validMonth);
        setSelectedWeek(getFirstWeekOfMonth(validMonth, selectedYear));
    };

    const handleWeekChange = (newWeek: number) => {
        const validWeek = newWeek < 1 ? 52 : newWeek > 52 ? 1 : newWeek;
        setSelectedWeek(validWeek);
        setSelectedMonthIndex(getMonthIndexFromWeek(validWeek, selectedYear));
    };

    // Estados de Filtros e Dropdowns
    const [selectedMachine, setSelectedMachine] = useState<string>('all');
    const [selectedOperator, setSelectedOperator] = useState<string>('all');
    const [selectedClient, setSelectedClient] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'agendada', 'em_andamento', 'concluida', 'conflito'

    const [machineDropdownOpen, setMachineDropdownOpen] = useState(false);
    const [operatorDropdownOpen, setOperatorDropdownOpen] = useState(false);
    const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

    // Listas para os Dropdowns
    const machinesList = ['Case Magnum 340', 'John Deere S770', 'Patriot 350', 'Valtra T250', 'DJI Matrice'];
    const operatorsList = ['Marcos Silva', 'Carlos Mendes', 'Rodrigo Morais', 'Lucas Guedes'];
    const clientsList = ['Agropecuária Santa Fé', 'Cooperativa Vale Verde'];

    // Filtragem dos cards
    const filteredOrders = INITIAL_ORDERS.filter(order => {
        if (selectedMachine !== 'all' && !order.machine.includes(selectedMachine)) return false;
        if (selectedOperator !== 'all' && !order.operator.includes(selectedOperator)) return false;
        if (selectedClient !== 'all' && !order.client.includes(selectedClient)) return false;
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;
        return true;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300 font-inter">
            {/* 1. Breadcrumb + Cabeçalho da Página & Controles de Visão */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <span>Operações de Campo</span>
                    <span>/</span>
                    <span className="text-emerald-500 font-semibold">Planejamento & Escalas</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                            Agenda Agrícola & Operacional
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsReportModalOpen(true)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${isDark
                                ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200'
                                : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                                }`}
                        >
                            <FileText className="w-4 h-4 text-neutral-400" />
                            <span>Gerar Relatório</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Barra de Estatísticas / KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">Alocações da Safra</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>16</span>
                            <span className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>OS Programadas</span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                        <FileText className="w-5 h-5" />
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">Em Execução</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-amber-500">1</span>
                            <span className="text-xs text-neutral-400">Talhão 04</span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-950/50 text-amber-400 border border-amber-800/30' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">Frota em Uso</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-blue-500">5</span>
                            <span className="text-xs text-neutral-400">Tratores & Pulveriz.</span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-950/50 text-blue-400 border border-blue-800/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                        <Wrench className="w-5 h-5" />
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">Conflitos de Escala</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-rose-500">1</span>
                            <span className="text-xs text-neutral-400">Case Magnum 340</span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-rose-950/50 text-rose-400 border border-rose-800/30' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* 3. Barra de Busca, Seletores de Equipamento & Controles de Período */}
            <div
                className="p-4 rounded-2xl border shadow-2xs space-y-4 transition-colors relative z-20"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código OS, operador, equipamento ou cliente..."
                            className={`w-full pl-10 pr-12 py-2 rounded-xl text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-[#2d7044]/40 ${isDark ? 'bg-neutral-900/80 border-neutral-700 text-white placeholder-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                                }`}
                        />
                        <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono-code px-1.5 py-0.5 rounded border ${isDark ? 'border-neutral-700 text-neutral-400 bg-neutral-800' : 'border-neutral-300 text-neutral-500 bg-neutral-200'}`}>
                            ⌘K
                        </kbd>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* 1. Seletor de Ano */}
                        <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                            <button
                                type="button"
                                onClick={() => setSelectedYear(prev => prev - 1)}
                                aria-label="Ano Anterior"
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-semibold font-mono-code text-center min-w-[45px]" style={{ color: currentTheme.textPrimary }}>
                                {selectedYear}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedYear(prev => prev + 1)}
                                aria-label="Próximo Ano"
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* 2. Seletor de Mês / Semana / Período (Adaptativo & Sincronizado) */}
                        {currentView === 'month' && (
                            <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                                <button
                                    type="button"
                                    onClick={() => handleMonthChange(selectedMonthIndex - 1)}
                                    aria-label="Mês Anterior"
                                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 text-xs font-semibold font-mono-code text-center min-w-[75px]" style={{ color: currentTheme.textPrimary }}>
                                    {MONTHS[selectedMonthIndex]}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleMonthChange(selectedMonthIndex + 1)}
                                    aria-label="Próximo Mês"
                                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {currentView === 'week' && (
                            <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                                <button
                                    type="button"
                                    onClick={() => handleWeekChange(selectedWeek - 1)}
                                    aria-label="Semana Anterior"
                                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 text-xs font-semibold font-mono-code text-center min-w-[90px]" style={{ color: currentTheme.textPrimary }}>
                                    Semana {selectedWeek}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleWeekChange(selectedWeek + 1)}
                                    aria-label="Próxima Semana"
                                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {currentView === 'timeline' && (
                            <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                                <button
                                    type="button"
                                    onClick={() => handleWeekChange(selectedWeek - 1)}
                                    aria-label="Período Anterior"
                                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 text-xs font-semibold font-mono-code text-center min-w-[125px]" style={{ color: currentTheme.textPrimary }}>
                                    {MONTHS[getMonthIndexFromWeek(selectedWeek, selectedYear)]} (Sem. {selectedWeek})
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleWeekChange(selectedWeek + 1)}
                                    aria-label="Próximo Período"
                                    className={`p-1 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {/* Alternador de Visão */}
                        <div className={`flex items-center p-1 rounded-xl border ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200'}`}>
                            <button
                                type="button"
                                onClick={() => setCurrentView('month')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentView === 'month' ? 'bg-[#2d7044] text-white shadow-2xs' : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
                            >
                                Mês
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView('week')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentView === 'week' ? 'bg-[#2d7044] text-white shadow-2xs' : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
                            >
                                Semana
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView('timeline')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentView === 'timeline' ? 'bg-[#2d7044] text-white shadow-2xs' : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'}`}
                            >
                                Linha do Tempo
                            </button>
                        </div>

                        {/* Dropdown Máquinas */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => { setMachineDropdownOpen(!machineDropdownOpen); setOperatorDropdownOpen(false); setClientDropdownOpen(false); }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{selectedMachine === 'all' ? 'Máquinas: Todas' : `Máquina: ${selectedMachine}`}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                            </button>
                            {machineDropdownOpen && (
                                <div className={`absolute left-0 mt-2 w-56 rounded-xl border shadow-xl py-1 z-30 ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'}`}>
                                    <button type="button" onClick={() => { setSelectedMachine('all'); setMachineDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>Todas as Máquinas</button>
                                    {machinesList.map(m => (
                                        <button key={m} type="button" onClick={() => { setSelectedMachine(m); setMachineDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>{m}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dropdown Colaboradores */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => { setOperatorDropdownOpen(!operatorDropdownOpen); setMachineDropdownOpen(false); setClientDropdownOpen(false); }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <User className="w-3.5 h-3.5 text-blue-500" />
                                <span>{selectedOperator === 'all' ? 'Colaboradores: Todos' : `Op: ${selectedOperator}`}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                            </button>
                            {operatorDropdownOpen && (
                                <div className={`absolute left-0 mt-2 w-56 rounded-xl border shadow-xl py-1 z-30 ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'}`}>
                                    <button type="button" onClick={() => { setSelectedOperator('all'); setOperatorDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>Todos os Colaboradores</button>
                                    {operatorsList.map(op => (
                                        <button key={op} type="button" onClick={() => { setSelectedOperator(op); setOperatorDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>{op}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dropdown Clientes */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => { setClientDropdownOpen(!clientDropdownOpen); setMachineDropdownOpen(false); setOperatorDropdownOpen(false); }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                    }`}
                            >
                                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                                <span>{selectedClient === 'all' ? 'Clientes: Todos' : `Cliente: ${selectedClient}`}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                            </button>
                            {clientDropdownOpen && (
                                <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-xl py-1 z-30 ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'}`}>
                                    <button type="button" onClick={() => { setSelectedClient('all'); setClientDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>Todos os Clientes</button>
                                    {clientsList.map(c => (
                                        <button key={c} type="button" onClick={() => { setSelectedClient(c); setClientDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-xs ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}>{c}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Barra de Status Clicável estilo Abas Padrão */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t pt-3" style={{ borderColor: currentTheme.border }}>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'all'
                            ? 'bg-[#2d7044] text-white shadow-2xs'
                            : isDark ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        Todas as OS
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('agendada')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'agendada'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : isDark ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block mr-1.5" />
                        Agendadas
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('em_andamento')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'em_andamento'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : isDark ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block mr-1.5" />
                        Em Andamento
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('concluida')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'concluida'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : isDark ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5" />
                        Concluídas
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter('conflito')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${statusFilter === 'conflito'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : isDark ? 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                            }`}
                    >
                        <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                        Conflitos
                    </button>
                </div>
            </div>

            {/* 4. Visualização Mensal / Calendário / Grid com Scroll Horizontal Protegido */}
            {currentView === 'month' && (
                <div
                    className="rounded-2xl border overflow-x-auto shadow-2xs transition-colors"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="min-w-[750px]">
                        <div
                            className="grid grid-cols-7 text-center py-3 border-b text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-jakarta"
                            style={{
                                backgroundColor: isDark ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 0.8)',
                                borderColor: currentTheme.border,
                            }}
                        >
                            <span className="text-neutral-500">Dom</span>
                            <span>Seg</span>
                            <span>Ter</span>
                            <span>Qua</span>
                            <span>Qui</span>
                            <span>Sex</span>
                            <span className="text-neutral-500">Sáb</span>
                        </div>

                        <div className="grid grid-cols-7 gap-px" style={{ backgroundColor: currentTheme.border }}>
                            {Array.from({ length: 35 }).map((_, i) => {
                                const dayNum = i - 1;
                                const isToday = dayNum === 24;
                                const dayOrders = filteredOrders.filter(o => o.day === dayNum);

                                return (
                                    <div
                                        key={i}
                                        className={`min-h-[135px] p-2.5 flex flex-col gap-2 transition-colors ${isToday
                                            ? isDark ? 'bg-neutral-900/90 ring-1 ring-emerald-500/50' : 'bg-emerald-50/50 ring-1 ring-emerald-500/50'
                                            : dayNum > 0 && dayNum <= 31
                                                ? isDark ? 'bg-neutral-900/40 hover:bg-neutral-800/40 cursor-pointer' : 'bg-white hover:bg-neutral-50 cursor-pointer'
                                                : isDark ? 'bg-neutral-950/40 opacity-30 pointer-events-none' : 'bg-neutral-100/50 opacity-40 pointer-events-none'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-mono-code font-semibold px-2 py-0.5 rounded border ${isToday
                                                ? isDark ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/40' : 'text-emerald-700 bg-emerald-100 border-emerald-300'
                                                : 'text-neutral-400 border-transparent'
                                                }`}>
                                                {dayNum > 0 && dayNum <= 31 ? (dayNum < 10 ? `0${dayNum}` : dayNum) : ''}
                                            </span>
                                            {dayNum > 0 && dayNum <= 31 && (
                                                <button type="button" className="text-neutral-500 hover:text-emerald-500 transition-colors cursor-pointer">
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Cards de Alocação de OS */}
                                        {dayOrders.map(order => {
                                            const isRunning = order.status === 'em_andamento';
                                            const isConflict = order.status === 'conflito';
                                            const isCompleted = order.status === 'concluida';

                                            return (
                                                <button
                                                    key={order.id}
                                                    type="button"
                                                    onClick={() => setActiveOsCode(`OS ${order.code}`)}
                                                    className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer group ${isRunning
                                                        ? isDark ? 'bg-amber-950/30 border-amber-600/40 hover:border-amber-500' : 'bg-amber-50 border-amber-300 hover:border-amber-500'
                                                        : isConflict
                                                            ? isDark ? 'bg-rose-950/40 border-rose-800/50' : 'bg-rose-50 border-rose-300'
                                                            : isDark ? 'bg-neutral-800/80 border-neutral-700/60 hover:border-emerald-500' : 'bg-neutral-50 border-neutral-200 hover:border-emerald-600'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-mono-code text-[10px] font-bold ${isRunning ? 'text-amber-400' : isConflict ? 'text-rose-400' : 'text-emerald-500'}`}>
                                                            {order.code}
                                                        </span>
                                                        {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                                                        {isConflict && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                                                        {isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                                    </div>
                                                    <p className="text-[11px] font-semibold tracking-tight truncate mt-0.5 group-hover:text-emerald-500" style={{ color: currentTheme.textPrimary }}>
                                                        {order.title}
                                                    </p>
                                                    <span className="text-[10px] text-neutral-400 font-mono-code truncate block mt-0.5">
                                                        {order.machine} • {order.operator}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {currentView === 'week' && (
                <div
                    className="rounded-2xl border shadow-2xs transition-colors overflow-hidden"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    {/* Cabeçalho da Semana */}
                    <div
                        className="p-4 border-b flex items-center justify-between flex-wrap gap-3"
                        style={{
                            borderColor: currentTheme.border,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                        }}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                <Grid className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                    Escala Operacional Semanal (Semana 43)
                                </h3>
                                <p className="text-xs text-neutral-400">
                                    Turnos: Manhã (06h - 12h) | Tarde (13h - 18h) | Noite (19h - 02h)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-mono-code ${isDark ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                18 Operações Previstas
                            </span>
                        </div>
                    </div>

                    {/* Grid dos 7 Dias da Semana com Scroll Horizontal Protegido */}
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-7 gap-px min-w-[840px]" style={{ backgroundColor: currentTheme.border }}>
                            {[
                                { dayName: 'Dom', dayNum: 20, isToday: false, isRest: true, items: [] },
                                {
                                    dayName: 'Seg',
                                    dayNum: 21,
                                    isToday: false,
                                    items: [
                                        { shift: 'Manhã', code: '#8840', title: 'Pulverização Defensivos', machine: 'Patriot 350', op: 'Rodrigo M.', status: 'concluida' },
                                        { shift: 'Tarde', code: '#8843', title: 'Limpeza & Calibração', machine: 'Oficina Central', op: 'Mecânicos', status: 'concluida' },
                                    ]
                                },
                                {
                                    dayName: 'Ter',
                                    dayNum: 22,
                                    isToday: false,
                                    items: [
                                        { shift: 'Manhã/Tarde', code: '#8841', title: 'Colheita de Milho', machine: 'JD S770 • 120 ha', op: 'Carlos A.', status: 'concluida' },
                                    ]
                                },
                                {
                                    dayName: 'Qua',
                                    dayNum: 23,
                                    isToday: false,
                                    items: [
                                        { shift: 'Manhã', code: '#8845', title: 'Plantio Soja Safra', machine: 'Valtra T250', op: 'Lucas G.', status: 'agendada' },
                                    ]
                                },
                                {
                                    dayName: 'Qui',
                                    dayNum: 24,
                                    isToday: true,
                                    items: [
                                        { shift: 'Manhã (Em Curso)', code: '#8839', title: 'Preparação de Solo', machine: 'Case Magnum 340', op: 'Marcos S.', time: '06h 45m', status: 'em_andamento' },
                                        { shift: 'Tarde', code: '#8842', title: 'Adubação Cobertura', machine: 'Amazone 300', op: 'Carlos M.', status: 'agendada' }
                                    ]
                                },
                                {
                                    dayName: 'Sex',
                                    dayNum: 25,
                                    isToday: false,
                                    items: [
                                        { shift: 'Manhã', code: '#8849', title: 'Conflito de Alocação', machine: 'Case Magnum 340', op: 'Marcos S.', status: 'conflito' },
                                    ]
                                },
                                {
                                    dayName: 'Sáb',
                                    dayNum: 26,
                                    isToday: false,
                                    items: [
                                        { shift: 'Manhã', code: '#8854', title: 'Manutenção Preventiva', machine: 'Oficina Central', op: 'Mecânicos', status: 'agendada' },
                                    ]
                                },
                            ].map((day, idx) => (
                                <div
                                    key={idx}
                                    className={`min-h-[420px] p-3 flex flex-col gap-3 transition-colors ${day.isToday
                                        ? isDark ? 'bg-neutral-900/90 ring-2 ring-emerald-500/60' : 'bg-emerald-50/50 ring-2 ring-emerald-500/60'
                                        : isDark ? 'bg-neutral-900/40 hover:bg-neutral-800/40' : 'bg-white hover:bg-neutral-50'
                                        }`}
                                >
                                    <div className={`pb-2 border-b text-center ${day.isToday ? 'border-emerald-500/40' : 'border-neutral-800'}`}>
                                        <span className={`text-[11px] font-bold uppercase tracking-wider block ${day.isToday ? 'text-emerald-400' : 'text-neutral-400'}`}>
                                            {day.dayName} {day.isToday && '• HOJE'}
                                        </span>
                                        <span className={`text-base font-bold font-mono-code ${day.isToday ? 'text-emerald-400' : 'text-neutral-300'}`}>
                                            {day.dayNum}
                                        </span>
                                    </div>

                                    {day.isRest ? (
                                        <div className="flex-1 flex items-center justify-center text-center p-4 rounded-xl border border-dashed border-neutral-800/60 text-neutral-500 text-xs font-medium">
                                            Sem alocações para repouso semanal
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5">
                                            {day.items.map((item, itemIdx) => {
                                                const isRunning = item.status === 'em_andamento';
                                                const isConflict = item.status === 'conflito';
                                                const isCompleted = item.status === 'concluida';

                                                return (
                                                    <div
                                                        key={itemIdx}
                                                        onClick={() => setActiveOsCode(`OS ${item.code}`)}
                                                        className={`p-2.5 rounded-xl border transition-all cursor-pointer group ${isRunning
                                                            ? isDark ? 'bg-amber-950/30 border-amber-600/50 hover:border-amber-400 shadow-xs' : 'bg-amber-50 border-amber-300 hover:border-amber-500 shadow-xs'
                                                            : isConflict
                                                                ? isDark ? 'bg-rose-950/40 border-rose-800/60 hover:border-rose-500' : 'bg-rose-50 border-rose-300 hover:border-rose-500'
                                                                : isCompleted
                                                                    ? isDark ? 'bg-neutral-800/60 border-neutral-700/60 hover:border-emerald-500' : 'bg-neutral-50 border-neutral-200 hover:border-emerald-600'
                                                                    : isDark ? 'bg-neutral-800/40 border-neutral-700/40 hover:border-blue-500' : 'bg-white border-neutral-200 hover:border-blue-500'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-1 mb-1">
                                                            <span className="text-[10px] font-mono-code font-medium text-neutral-400">
                                                                {item.shift}
                                                            </span>
                                                            <span
                                                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono-code ${isRunning
                                                                    ? isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                                                                    : isConflict
                                                                        ? isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-800'
                                                                        : isCompleted
                                                                            ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                                                                            : isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                                                                    }`}
                                                            >
                                                                {item.code}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xs font-semibold tracking-tight truncate group-hover:text-emerald-400 transition-colors" style={{ color: currentTheme.textPrimary }}>
                                                            {item.title}
                                                        </h4>
                                                        <div className="text-[10px] text-neutral-400 font-mono-code mt-1 space-y-0.5">
                                                            <div className="truncate flex items-center gap-1">
                                                                <Wrench className="w-3 h-3 text-neutral-500 shrink-0" />
                                                                <span>{item.machine}</span>
                                                            </div>
                                                            <div className="truncate flex items-center justify-between">
                                                                <span className="flex items-center gap-1">
                                                                    <User className="w-3 h-3 text-neutral-500 shrink-0" />
                                                                    <span>{item.op}</span>
                                                                </span>
                                                                {item.time && (
                                                                    <span className="text-amber-400 font-semibold">{item.time}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {currentView === 'timeline' && (
                <div
                    className="rounded-2xl border shadow-2xs transition-colors overflow-hidden"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    {/* Cabeçalho do Gantt */}
                    <div
                        className="p-4 border-b flex items-center justify-between flex-wrap gap-3"
                        style={{
                            borderColor: currentTheme.border,
                            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                        }}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                <SlidersHorizontal className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                    Cronograma de Alocação por Equipamento (Gantt)
                                </h3>
                                <p className="text-xs text-neutral-400">
                                    Visão cronológica de utilização de tratores, colheitadeiras e implementos (20 Out - 26 Out)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-mono-code ${isDark ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                Safra 2024/2025
                            </span>
                        </div>
                    </div>

                    {/* Tabela Gantt com Scroll Horizontal */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[850px]">
                            {/* Header com Dias da Semana */}
                            <div
                                className="grid grid-cols-8 border-b text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-jakarta py-2.5"
                                style={{
                                    borderColor: currentTheme.border,
                                    backgroundColor: isDark ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 0.8)',
                                }}
                            >
                                <div className="px-4 text-neutral-300 col-span-2">Equipamento / Máquina</div>
                                <div className="text-center text-neutral-500">20 Dom</div>
                                <div className="text-center">21 Seg</div>
                                <div className="text-center">22 Ter</div>
                                <div className="text-center">23 Qua</div>
                                <div className="text-center text-emerald-400 font-bold">24 Qui (Hoje)</div>
                                <div className="text-center">25 Sex</div>
                            </div>

                            {/* Rows de Equipamentos */}
                            {[
                                {
                                    name: 'Case Magnum 340',
                                    type: 'Trator de Pneu',
                                    code: 'TRAT-09',
                                    days: [
                                        { dayNum: 20, free: true },
                                        { dayNum: 21, free: true },
                                        { dayNum: 22, osCode: '#8794', title: 'Grade Niveladora', status: 'concluida', op: 'Marcos S.' },
                                        { dayNum: 23, free: true },
                                        { dayNum: 24, osCode: '#8839', title: 'Preparação Solo', status: 'em_andamento', op: 'Marcos S.' },
                                        { dayNum: 25, osCode: '#8849', title: 'Conflito Duplicado', status: 'conflito', op: 'Marcos S.' },
                                    ]
                                },
                                {
                                    name: 'John Deere S770',
                                    type: 'Colheitadeira de Grãos',
                                    code: 'COLH-02',
                                    days: [
                                        { dayNum: 20, free: true },
                                        { dayNum: 21, free: true },
                                        { dayNum: 22, osCode: '#8841', title: 'Colheita Milho (120ha)', status: 'concluida', op: 'Carlos A.' },
                                        { dayNum: 23, osCode: '#8841', title: 'Colheita Milho', status: 'concluida', op: 'Carlos A.' },
                                        { dayNum: 24, osCode: '#8850', title: 'Standby / Check', status: 'agendada', op: 'Equipe' },
                                        { dayNum: 25, free: true },
                                    ]
                                },
                                {
                                    name: 'Patriot 350',
                                    type: 'Pulverizador Autopropelido',
                                    code: 'PULV-04',
                                    days: [
                                        { dayNum: 20, free: true },
                                        { dayNum: 21, osCode: '#8840', title: 'Pulveriz. Defensivos', status: 'concluida', op: 'Rodrigo M.' },
                                        { dayNum: 22, free: true },
                                        { dayNum: 23, free: true },
                                        { dayNum: 24, osCode: '#8848', title: 'Revisão Filtros', status: 'agendada', op: 'Mecânicos' },
                                        { dayNum: 25, osCode: '#8866', title: 'Dessecação Pré-Em.', status: 'agendada', op: 'Rodrigo M.' },
                                    ]
                                },
                                {
                                    name: 'Valtra T250',
                                    type: 'Trator Média Potência',
                                    code: 'TRAT-14',
                                    days: [
                                        { dayNum: 20, free: true },
                                        { dayNum: 21, free: true },
                                        { dayNum: 22, osCode: '#8822', title: 'Tratos Culturais', status: 'concluida', op: 'Lucas G.' },
                                        { dayNum: 23, osCode: '#8845', title: 'Plantio Soja Safra', status: 'agendada', op: 'Lucas G.' },
                                        { dayNum: 24, osCode: '#8845', title: 'Plantio Soja Safra', status: 'agendada', op: 'Lucas G.' },
                                        { dayNum: 25, osCode: '#8860', title: 'Plantio Talhão 08', status: 'agendada', op: 'Lucas G.' },
                                    ]
                                },
                                {
                                    name: 'DJI Matrice 300',
                                    type: 'Drone Agrícola RTK',
                                    code: 'DRON-01',
                                    days: [
                                        { dayNum: 20, free: true },
                                        { dayNum: 21, osCode: '#8802', title: 'Mapeamento NDVI', status: 'concluida', op: 'Lucas G.' },
                                        { dayNum: 22, free: true },
                                        { dayNum: 23, free: true },
                                        { dayNum: 24, osCode: '#8855', title: 'Voo Ortomosaico', status: 'agendada', op: 'Lucas G.' },
                                        { dayNum: 25, free: true },
                                    ]
                                },
                            ].map((row, rowIdx) => (
                                <div
                                    key={rowIdx}
                                    className="grid grid-cols-8 border-b items-center py-3"
                                    style={{ borderColor: currentTheme.border }}
                                >
                                    <div className="px-4 col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg border ${isDark ? 'bg-neutral-800/80 border-neutral-700 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-700'}`}>
                                                <Wrench className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="truncate">
                                                <div className="text-xs font-semibold truncate" style={{ color: currentTheme.textPrimary }}>
                                                    {row.name}
                                                </div>
                                                <div className="text-[10px] text-neutral-400 font-mono-code truncate">
                                                    {row.code} • {row.type}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {row.days.map((d, dIdx) => (
                                        <div key={dIdx} className="px-1 py-1">
                                            {d.free ? (
                                                <div className={`h-10 rounded-lg border border-dashed flex items-center justify-center ${isDark ? 'border-neutral-800/40 bg-neutral-900/20' : 'border-neutral-200 bg-neutral-50'}`}>
                                                    <span className="text-[9px] font-mono-code text-neutral-500">Livre</span>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => setActiveOsCode(`OS ${d.osCode}`)}
                                                    className={`h-10 rounded-lg p-1.5 border transition-all cursor-pointer flex flex-col justify-between ${d.status === 'em_andamento'
                                                        ? isDark ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/40' : 'bg-amber-100 border-amber-300 text-amber-900 ring-1 ring-amber-400/40'
                                                        : d.status === 'conflito'
                                                            ? isDark ? 'bg-rose-950/50 border-rose-600/70 text-rose-300' : 'bg-rose-100 border-rose-300 text-rose-900'
                                                            : d.status === 'concluida'
                                                                ? isDark ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                                                                : isDark ? 'bg-blue-950/40 border-blue-700/50 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-900'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between text-[9px] font-mono-code font-bold leading-none">
                                                        <span>{d.osCode}</span>
                                                        {d.status === 'em_andamento' && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] font-semibold leading-tight truncate">
                                                        {d.title}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Global de OS */}
            {activeOsCode && (
                <OrderServiceModal
                    osCode={activeOsCode}
                    themeMode={themeMode}
                    onClose={() => setActiveOsCode(null)}
                    onComplete={() => alert('Ordem de serviço homologada com sucesso!')}
                />
            )}

            {/* Modal de Relatórios */}
            {isReportModalOpen && (
                <ReportExportModal
                    themeMode={themeMode}
                    onClose={() => setIsReportModalOpen(false)}
                    onSuccessExport={() => alert('Relatório exportado com sucesso!')}
                />
            )}
        </div>
    );
};