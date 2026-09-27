import React, { useState, useMemo } from 'react';
import { colors, type ThemeMode } from '../../../styles/theme';
import {
    Search, Download, Plus,
    RotateCcw, Tractor, Wrench, MapPin, Zap,
    ArrowRight, Phone, Mail, MessageSquare
} from 'lucide-react';
import { ReportExportModal } from '../../modals/reportModal/ReportExportModal';
import { OrderServiceModal } from '../../modals/osModal/OrderServiceModal';
import { NewMachineryModal } from '../../modals/newMachineryModal/NewMachineryModal';
import { MachineryDetailsPage } from './MachineryDetailsPage';

export interface MachineryItem {
    id: string;
    name: string;
    tag: string;
    category: string;
    power: string;
    status: 'em_operacao' | 'disponivel' | 'manutencao';
    hours: string;
    hoursToday: string;
    location: string;
    base: string;
    operator: string;
    telemetry: string;
    details: string;
}

export interface MachineryPageProps {
    themeMode?: ThemeMode;
}

const INITIAL_MACHINERY: MachineryItem[] = [
    {
        id: '1',
        name: 'Case Magnum 340',
        tag: '#09 | TR-09',
        category: 'Trator Pesado',
        power: '340 cv • Grade Avaré 36x32',
        status: 'em_operacao',
        hours: '2.842,4 h',
        hoursToday: '+6.8h hoje',
        location: 'Talhão 14 - Soja',
        base: 'Fazenda Morro Grande - Sede',
        operator: 'Marcos S.',
        telemetry: 'RTK 18 sats • Consumo: 16.8 L/h • RPM: 1.820',
        details: 'Trator Pesado • Operacional',
    },
    {
        id: '2',
        name: 'John Deere S770',
        tag: '#04 | CH-04',
        category: 'Colheitadeira',
        power: '460 cv • Plataforma 40ft',
        status: 'em_operacao',
        hours: '1.420,8 h',
        hoursToday: '+8.2h hoje',
        location: 'Talhão 07 - Milho Safrinha',
        base: 'Agropecuária Boa Vista',
        operator: 'Tiago R.',
        telemetry: 'RTK 22 sats • Consumo: 32.1 L/h • Umid: 13.8%',
        details: 'Colheitadeira de Grãos',
    },
    {
        id: '3',
        name: 'Case Patriot 350',
        tag: '#02 | PV-02',
        category: 'Pulverizador',
        power: '250 cv • Barra 36m',
        status: 'em_operacao',
        hours: '3.110,2 h',
        hoursToday: '+4.5h hoje',
        location: 'Talhão 02 - Pivô Central',
        base: 'Fazenda Morro Grande',
        operator: 'Carlos E.',
        telemetry: 'RTK 20 sats • Taxa: 110 L/ha • Vento: 4.2 km/h',
        details: 'Pulverizador Autopropelido',
    },
    {
        id: '4',
        name: 'Valtra T250 CVT',
        tag: '#11 | TR-11',
        category: 'Trator Médio',
        power: '250 cv • Transmissão CVT',
        status: 'disponivel',
        hours: '980,5 h',
        hoursToday: 'Parado há 1d',
        location: 'Pátio Central / Garagem Sul',
        base: 'Hangar Principal',
        operator: 'Nenhum alocado',
        telemetry: 'Standby / Bateria 98% • Último reporte: há 14 min',
        details: 'Disponível no Pátio',
    },
    {
        id: '5',
        name: 'New Holland CR 8.90',
        tag: '#06 | CH-06',
        category: 'Colheitadeira',
        power: '500 cv • Duplo Rotor',
        status: 'manutencao',
        hours: '4.150,0 h',
        hoursToday: 'Revisão atingida',
        location: 'Oficina Central / Box 02',
        base: 'Fazenda Morro Grande - Sede',
        operator: 'Oficina / Mário D.',
        telemetry: 'Modo Manutenção • Troca de Óleo / Filtros',
        details: 'Revisão Preventiva',
    },
    {
        id: '6',
        name: 'DJI Agras T40',
        tag: '#01 | DR-01',
        category: 'Drone',
        power: 'Drone Pulverizador • 40L',
        status: 'disponivel',
        hours: '184,2 h',
        hoursToday: '92 ciclos voo',
        location: 'Ponto de Apoio Norte',
        base: 'Trailer de Carga Rápida',
        operator: 'Operador Remoto V.',
        telemetry: 'GPS RTK Centimétrico • Calibração bicos OK',
        details: 'Disponível / Bateria 100%',
    }
];

export const MachineryPage: React.FC<MachineryPageProps> = ({ themeMode = 'dark' }) => {
    const currentTheme = colors[themeMode || 'dark'];

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [baseFilter, setBaseFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('horimeter-desc');
    const [selectedMachinery, setSelectedMachinery] = useState<MachineryItem | null>(null);
    const [activePhoneMenuId, setActivePhoneMenuId] = useState<string | null>(null);

    // Modals
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [activeOsCode, setActiveOsCode] = useState<string | null>(null);

    // Dynamic filtering
    const filteredMachines = useMemo(() => {
        return INITIAL_MACHINERY.filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.operator.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === 'all' ||
                (categoryFilter === 'trator' && item.category.toLowerCase().includes('trator')) ||
                (categoryFilter === 'colheitadeira' && item.category.toLowerCase().includes('colheitadeira')) ||
                (categoryFilter === 'pulverizador' && item.category.toLowerCase().includes('pulverizador')) ||
                (categoryFilter === 'drone' && item.category.toLowerCase().includes('drone'));

            const matchesBase =
                baseFilter === 'all' ||
                (baseFilter === 'morro grande' && item.base.toLowerCase().includes('morro grande')) ||
                (baseFilter === 'boa vista' && item.base.toLowerCase().includes('boa vista')) ||
                (baseFilter === 'norte' && item.base.toLowerCase().includes('norte'));

            return matchesSearch && matchesCategory && matchesBase;
        }).sort((a, b) => {
            if (sortOrder === 'horimeter-desc') {
                return parseFloat(b.hours.replace('.', '').replace(',', '.')) - parseFloat(a.hours.replace('.', '').replace(',', '.'));
            }
            if (sortOrder === 'horimeter-asc') {
                return parseFloat(a.hours.replace('.', '').replace(',', '.')) - parseFloat(b.hours.replace('.', '').replace(',', '.'));
            }
            if (sortOrder === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
    }, [searchQuery, categoryFilter, baseFilter, sortOrder]);

    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('all');
        setBaseFilter('all');
        setSortOrder('horimeter-desc');
    };

    // If a machinery item is selected, render the full Details screen!
    if (selectedMachinery) {
        return (
            <>
                <MachineryDetailsPage
                    machinery={selectedMachinery}
                    themeMode={themeMode}
                    onBack={() => setSelectedMachinery(null)}
                    onEdit={(m) => alert(`Editar perfil do maquinário: ${m.name}`)}
                    onOpenOS={(code) => setActiveOsCode(code)}
                />

                {/* Modal de O.S. se acionado */}
                {activeOsCode && (
                    <OrderServiceModal
                        onClose={() => setActiveOsCode(null)}
                        themeMode={themeMode}
                        osCode={activeOsCode}
                    />
                )}
            </>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300 font-inter">
            {/* 1. Header principal + Ações Globais */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                <div>
                    <div className="flex items-center gap-2 text-xs font-medium mb-1" style={{ color: currentTheme.textSecondary }}>
                        <span>Operações Agrícolas</span>
                        <span>/</span>
                        <span className="font-semibold" style={{ color: currentTheme.primary }}>Frota & Maquinário</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                            Maquinário Agrícola
                        </h1>
                        <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-code border"
                            style={{
                                backgroundColor: currentTheme.badgeSuccess.bg,
                                color: currentTheme.badgeSuccess.text,
                                borderColor: currentTheme.badgeSuccess.border,
                            }}
                        >
                            28 Ativos na Frota
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs"
                        style={{
                            backgroundColor: currentTheme.surface,
                            borderColor: currentTheme.border,
                            color: currentTheme.textPrimary,
                        }}
                    >
                        <Download className="w-4 h-4" style={{ color: currentTheme.textSecondary }} />
                        <span>Gerar Relatório</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsNewModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                        style={{ backgroundColor: currentTheme.primary }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Cadastrar Maquinário</span>
                    </button>
                </div>
            </div>

            {/* 2. KPI Cards da Frota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Total de Máquinas</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.iconBoxSuccess.bg,
                                color: currentTheme.iconBoxSuccess.text,
                                borderColor: currentTheme.iconBoxSuccess.border,
                            }}
                        >
                            <Tractor className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>28</span>
                        <span className="text-xs" style={{ color: currentTheme.textMuted }}>100% monitorados</span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Em Operação</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.iconBoxSuccess.bg,
                                color: currentTheme.iconBoxSuccess.text,
                                borderColor: currentTheme.iconBoxSuccess.border,
                            }}
                        >
                            <Zap className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.badgeSuccess.text }}>18</span>
                        <span className="text-xs font-semibold font-mono-code" style={{ color: currentTheme.badgeSuccess.text }}>64% da frota</span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Disponíveis / Pátio</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.badgeNeutral.bg,
                                color: currentTheme.badgeNeutral.text,
                                borderColor: currentTheme.badgeNeutral.border,
                            }}
                        >
                            <Tractor className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>7</span>
                        <span className="text-xs font-mono-code" style={{ color: currentTheme.textMuted }}>25% da frota</span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs transition-all space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between" style={{ color: currentTheme.textSecondary }}>
                        <span className="text-xs font-semibold uppercase tracking-wider">Em Manutenção</span>
                        <div
                            className="p-2 rounded-xl border"
                            style={{
                                backgroundColor: currentTheme.iconBoxDanger.bg,
                                color: currentTheme.iconBoxDanger.text,
                                borderColor: currentTheme.iconBoxDanger.border,
                            }}
                        >
                            <Wrench className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.badgeDanger.text }}>3</span>
                        <span className="text-xs font-semibold font-mono-code" style={{ color: currentTheme.badgeDanger.text }}>11% da frota</span>
                    </div>
                </div>
            </div>

            {/* 3. Filtros & Pesquisa */}
            <div
                className="p-4 rounded-2xl border shadow-2xs space-y-4"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    {/* Campo de Pesquisa */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textMuted }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por modelo, tag (#09), categoria, operador ou talhão..."
                            className="w-full pl-10 pr-12 py-2 rounded-xl text-xs border transition-all focus:outline-none"
                            style={{
                                backgroundColor: currentTheme.inputBg,
                                borderColor: currentTheme.inputBorder,
                                color: currentTheme.inputText,
                            }}
                        />

                    </div>

                    {/* Dropdowns */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <select
                                value={baseFilter}
                                onChange={(e) => setBaseFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none"
                                style={{
                                    backgroundColor: currentTheme.dropdownBg,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                }}
                            >
                                <option value="all">Polos: Todos os Polos (Sede & Agros)</option>
                                <option value="morro grande">Polo Sede - Morro Grande</option>
                                <option value="boa vista">Unidade Boa Vista</option>
                                <option value="norte">Ponto de Apoio Norte</option>
                            </select>
                        </div>

                        <div className="relative">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all focus:outline-none"
                                style={{
                                    backgroundColor: currentTheme.dropdownBg,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                }}
                            >
                                <option value="horimeter-desc">Horímetro: Maior para Menor</option>
                                <option value="horimeter-asc">Horímetro: Menor para Maior</option>
                                <option value="name">Modelo: A-Z</option>
                            </select>
                        </div>

                        {(searchQuery || categoryFilter !== 'all' || baseFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer"
                                style={{
                                    backgroundColor: currentTheme.badgeDanger.bg,
                                    borderColor: currentTheme.badgeDanger.border,
                                    color: currentTheme.badgeDanger.text,
                                }}
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Limpar</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Pills Rápidas */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t pt-3" style={{ borderColor: currentTheme.border }}>
                    {[
                        { key: 'all', label: 'Todas (28)' },
                        { key: 'trator', label: 'Tratores (12)' },
                        { key: 'colheitadeira', label: 'Colheitadeiras (6)' },
                        { key: 'pulverizador', label: 'Pulverizadores (5)' },
                        { key: 'drone', label: 'Drones & Outros (5)' },
                    ].map((pill) => {
                        const isActive = categoryFilter === pill.key;
                        return (
                            <button
                                key={pill.key}
                                type="button"
                                onClick={() => setCategoryFilter(pill.key)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border"
                                style={
                                    isActive
                                        ? {
                                            backgroundColor: currentTheme.primary,
                                            color: '#FFFFFF',
                                            borderColor: currentTheme.primary,
                                        }
                                        : {
                                            backgroundColor: currentTheme.surfaceSecondary,
                                            color: currentTheme.textSecondary,
                                            borderColor: currentTheme.border,
                                        }
                                }
                            >
                                {pill.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 4. Tabela de Maquinário */}
            <div
                className="rounded-2xl border overflow-hidden shadow-2xs"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr
                                className="border-b uppercase tracking-wider text-[11px] font-semibold"
                                style={{
                                    backgroundColor: currentTheme.surfaceSecondary,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textMuted,
                                }}
                            >
                                <th className="py-3.5 px-4 font-jakarta">Identificação / Equipamento</th>
                                <th className="py-3.5 px-4 font-jakarta">Status</th>
                                <th className="py-3.5 px-4 font-jakarta">Horímetro</th>
                                <th className="py-3.5 px-4 font-jakarta">Localização & Base</th>
                                <th className="py-3.5 px-4 font-jakarta">Operador Alocado</th>
                                <th className="py-3.5 px-4 font-jakarta">Telemetria CAN</th>
                                <th className="py-3.5 px-4 font-jakarta text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                            {filteredMachines.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-xs italic" style={{ color: currentTheme.textMuted }}>
                                        Nenhum maquinário encontrado com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredMachines.map((m) => {
                                    const isOperating = m.status === 'em_operacao';
                                    const isMaintenance = m.status === 'manutencao';

                                    const badgeStyle = isOperating
                                        ? currentTheme.badgeSuccess
                                        : isMaintenance
                                            ? currentTheme.badgeDanger
                                            : currentTheme.badgeNeutral;

                                    return (
                                        <tr
                                            key={m.id}
                                            onClick={() => setSelectedMachinery(m)}
                                            className="transition-colors cursor-pointer"
                                            style={{
                                                backgroundColor: isMaintenance ? currentTheme.badgeDanger.bg + '15' : undefined,
                                            }}
                                        >
                                            {/* Coluna 1: Identificação */}
                                            <td className="py-3.5 px-4 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
                                                        style={{
                                                            backgroundColor: currentTheme.iconBoxSuccess.bg,
                                                            color: currentTheme.iconBoxSuccess.text,
                                                            borderColor: currentTheme.iconBoxSuccess.border,
                                                        }}
                                                    >
                                                        <Tractor className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-xs font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                                                {m.name}
                                                            </h4>
                                                            <span
                                                                className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold border"
                                                                style={{
                                                                    backgroundColor: currentTheme.badgeNeutral.bg,
                                                                    color: currentTheme.badgeNeutral.text,
                                                                    borderColor: currentTheme.badgeNeutral.border,
                                                                }}
                                                            >
                                                                {m.tag}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] block mt-0.5" style={{ color: currentTheme.textSecondary }}>
                                                            {m.power}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Coluna 2: Status */}
                                            <td className="py-3.5 px-4 align-top">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                                                    style={{
                                                        backgroundColor: badgeStyle.bg,
                                                        color: badgeStyle.text,
                                                        borderColor: badgeStyle.border,
                                                    }}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${isOperating ? 'animate-pulse' : ''}`}
                                                        style={{ backgroundColor: badgeStyle.text }}
                                                    />
                                                    {isOperating ? 'Em Operação' : isMaintenance ? 'Em Manutenção' : 'Disponível'}
                                                </span>
                                            </td>

                                            {/* Coluna 3: Horímetro */}
                                            <td className="py-3.5 px-4 align-top font-mono-code">
                                                <span className="text-xs font-bold block" style={{ color: currentTheme.textPrimary }}>
                                                    {m.hours}
                                                </span>
                                                <span className="text-[10px] block mt-0.5" style={{ color: currentTheme.textSecondary }}>
                                                    {m.hoursToday}
                                                </span>
                                            </td>

                                            {/* Coluna 4: Localização & Base */}
                                            <td className="py-3.5 px-4 align-top">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                                    <div>
                                                        <span className="text-xs font-semibold block" style={{ color: currentTheme.textPrimary }}>
                                                            {m.location}
                                                        </span>
                                                        <span className="text-[10px] block mt-0.5" style={{ color: currentTheme.textSecondary }}>
                                                            {m.base}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Coluna 5: Operador Alocado */}
                                            <td className="py-3.5 px-4 align-top">
                                                <span className="text-xs font-medium block" style={{ color: currentTheme.textPrimary }}>
                                                    {m.operator}
                                                </span>
                                            </td>

                                            {/* Coluna 6: Telemetria CAN */}
                                            <td className="py-3.5 px-4 align-top font-mono-code text-[11px]">
                                                <span className="block font-semibold" style={{ color: currentTheme.badgeSuccess.text }}>
                                                    {m.telemetry.split('•')[0]}
                                                </span>
                                                <span className="block mt-0.5 text-[10px]" style={{ color: currentTheme.textSecondary }}>
                                                    {m.telemetry.split('•').slice(1).join('•')}
                                                </span>
                                            </td>

                                            {/* Coluna 7: Ações */}
                                            <td className="py-3.5 px-4 align-top text-right">
                                                <div className="flex items-center justify-end gap-1.5 relative">
                                                    {/* Botão Telefone / Contato Operador */}
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActivePhoneMenuId(activePhoneMenuId === m.id ? null : m.id);
                                                            }}
                                                            className="p-2 rounded-xl border transition-all cursor-pointer shadow-xs"
                                                            style={{
                                                                backgroundColor: currentTheme.surface,
                                                                borderColor: currentTheme.border,
                                                                color: currentTheme.textSecondary,
                                                            }}
                                                            title="Opções de contato"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </button>

                                                        {/* Dropdown Menu */}
                                                        {activePhoneMenuId === m.id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-20"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActivePhoneMenuId(null);
                                                                    }}
                                                                />
                                                                <div
                                                                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl z-30 p-1.5 space-y-1 text-left backdrop-blur-md"
                                                                    style={{
                                                                        backgroundColor: currentTheme.dropdownBg,
                                                                        borderColor: currentTheme.border,
                                                                        color: currentTheme.textPrimary,
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div
                                                                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-b pb-1 mb-1"
                                                                        style={{
                                                                            color: currentTheme.textMuted,
                                                                            borderColor: currentTheme.border,
                                                                        }}
                                                                    >
                                                                        Opções de Contato
                                                                    </div>

                                                                    <a
                                                                        href="tel:16997000000"
                                                                        onClick={() => setActivePhoneMenuId(null)}
                                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
                                                                        style={{ color: currentTheme.textPrimary }}
                                                                    >
                                                                        <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                                                        <span>Ligar para Operador</span>
                                                                    </a>

                                                                    <a
                                                                        href="https://wa.me/5516997000000"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        onClick={() => setActivePhoneMenuId(null)}
                                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
                                                                        style={{ color: currentTheme.badgeSuccess.text }}
                                                                    >
                                                                        <MessageSquare className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.badgeSuccess.text }} />
                                                                        <span>WhatsApp Suporte</span>
                                                                    </a>

                                                                    <a
                                                                        href="mailto:suporte@morrogrande.com.br"
                                                                        onClick={() => setActivePhoneMenuId(null)}
                                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
                                                                        style={{ color: currentTheme.badgeInfo.text }}
                                                                    >
                                                                        <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.badgeInfo.text }} />
                                                                        <span>E-mail Manutenção</span>
                                                                    </a>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Botão Seta (Ir para Tela de Detalhes) */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedMachinery(m);
                                                        }}
                                                        className="p-2 rounded-xl border transition-all cursor-pointer shadow-xs"
                                                        style={{
                                                            backgroundColor: currentTheme.surface,
                                                            borderColor: currentTheme.border,
                                                            color: currentTheme.textPrimary,
                                                        }}
                                                        title="Abrir Tela de Detalhes"
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
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
            </div>

            {/* Modais */}
            {isReportModalOpen && (
                <ReportExportModal
                    themeMode={themeMode}
                    onClose={() => setIsReportModalOpen(false)}
                    onSuccessExport={() => alert('Relatório de Maquinários exportado com sucesso!')}
                />
            )}

            {isNewModalOpen && (
                <NewMachineryModal
                    onClose={() => setIsNewModalOpen(false)}
                    themeMode={themeMode}
                    onSuccessCreate={(data) => {
                        console.log('Novo Maquinário cadastrado:', data);
                        setIsNewModalOpen(false);
                    }}
                />
            )}

            {activeOsCode && (
                <OrderServiceModal
                    onClose={() => setActiveOsCode(null)}
                    themeMode={themeMode}
                    osCode={activeOsCode}
                />
            )}
        </div>
    );
};

