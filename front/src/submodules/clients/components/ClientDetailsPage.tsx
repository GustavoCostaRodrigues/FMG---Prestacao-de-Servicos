import React from 'react';
import {
    ArrowLeft, Phone, Mail, MessageSquare, Pencil,
    Building2, FileText,
    MapPin, User, ShieldCheck, MapPinned, Award
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import type { Client, Establishment } from './ClientsPage';

export interface ClientDetailsPageProps {
    client: Client;
    themeMode?: ThemeMode;
    onBack: () => void;
    onEdit?: (client: Client) => void;
}

export const ClientDetailsPage: React.FC<ClientDetailsPageProps> = ({
    client,
    themeMode = 'dark',
    onBack,
    onEdit,
}) => {
    const currentTheme = colors[themeMode || 'dark'];
    const isDark = themeMode === 'dark';

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const cleanPhone = client.phone.replace(/\D/g, '');

    // Default mock establishments if array is empty
    const establishmentsList: Establishment[] = client.establishments && client.establishments.length > 0
        ? client.establishments
        : [
            { id: 'est_default_1', name: `${client.name} - Sede Principal`, details: '1.200 ha • Milho & Soja' },
            { id: 'est_default_2', name: 'Unidade Agro-Industrial', details: '450 ha • Infraestrutura & Armazenamento' },
        ];

    return (
        <div className="space-y-6 animate-in fade-in duration-300 font-inter">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                <button
                    type="button"
                    onClick={onBack}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isDark
                            ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar para Lista de Clientes</span>
                </button>

                <div className="flex items-center gap-2">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(client)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2d7044] hover:bg-[#255d38] transition-all cursor-pointer shadow-md"
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Editar Cliente</span>
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
                        <div className={`w-20 h-20 rounded-2xl ${client.avatarBg} text-white font-bold text-2xl flex items-center justify-center shadow-md border-2 border-emerald-500/40 shrink-0 font-mono-code`}>
                            {getInitials(client.name)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                                    {client.name}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border font-mono-code ${
                                    isDark
                                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}>
                                    {client.id}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                        client.status === 'active'
                                            ? isDark
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                            : client.status === 'prospect'
                                            ? isDark
                                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                                : 'bg-amber-100 text-amber-800 border-amber-300'
                                            : isDark
                                            ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                            : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                                    }`}
                                >
                                    ● {client.status === 'active' ? 'Cliente Ativo' : client.status === 'prospect' ? 'Em Negociação' : 'Inativo'}
                                </span>
                            </div>

                            <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-2 flex-wrap font-medium">
                                <span className={`font-mono-code ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>CNPJ/CPF: {client.document}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                    {client.address}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Quick Action Contact Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <a
                            href={`tel:${cleanPhone}`}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                isDark
                                    ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                        >
                            <Phone className="w-4 h-4 text-emerald-500" />
                            <span>Ligar</span>
                        </a>

                        <a
                            href={`https://wa.me/55${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>WhatsApp</span>
                        </a>

                        <a
                            href={`mailto:${client.email}`}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                isDark
                                    ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                                    : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                            }`}
                        >
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span>E-mail</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">Estabelecimentos</span>
                        <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            <Building2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                            {client.establishmentsCount || establishmentsList.length}
                        </span>
                        <span className="text-xs text-neutral-400">Propriedades vinculadas</span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">OS em Andamento</span>
                        <div className="p-2 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-jakarta text-blue-400">
                            {client.activeOS}
                        </span>
                        <span className="text-xs text-neutral-400">Ordens de serviço</span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">Status do Contrato</span>
                        <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
                            <Award className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-jakarta text-purple-400">
                            Safra 24/25
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold font-mono-code">Regular</span>
                    </div>
                </div>

                <div
                    className="p-4 rounded-2xl border shadow-2xs space-y-2"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                >
                    <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">Área de Atendimento</span>
                        <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
                            <MapPinned className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-jakarta text-amber-400">
                            1.650 ha
                        </span>
                        <span className="text-xs text-neutral-400">Área total atendida</span>
                    </div>
                </div>
            </div>

            {/* Detailed Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Establishments List */}
                <div className="lg:col-span-2 space-y-6">
                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                    Estabelecimentos e Propriedades ({establishmentsList.length})
                                </h2>
                            </div>
                            <span className="text-xs text-neutral-400">Locais de Operação Agrícola</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {establishmentsList.map((est, index) => (
                                <div
                                    key={est.id || index}
                                    className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                                        isDark ? 'bg-neutral-900/60 border-neutral-800 hover:border-emerald-500/40' : 'bg-neutral-50 border-neutral-200 hover:border-emerald-500/40'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-neutral-200 font-jakarta">{est.name}</h3>
                                                <span className="text-[10px] text-emerald-400 font-medium">{index === 0 ? 'Estabelecimento Sede' : 'Unidade Operacional'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-neutral-400 font-medium">
                                        {est.details}
                                    </p>

                                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-neutral-500" />
                                            Região de Ribeirão Preto
                                        </span>
                                        <span className="text-emerald-400 font-semibold font-mono-code">Ativo</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active OS History */}
                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                    Ordens de Serviço Recentes
                                </h2>
                            </div>
                            <span className="text-xs text-neutral-400">Histórico de Atendimento</span>
                        </div>

                        <div className="space-y-3">
                            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40 font-mono-code font-bold text-xs">
                                        #OS-2024-089
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-neutral-200">Pulverização e Aplicação de Defensivos</h4>
                                        <p className="text-[11px] text-neutral-400 mt-0.5">Talhão 04 • Operador: Carlos Eduardo</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                                        Concluído
                                    </span>
                                    <span className="block text-[10px] font-mono-code text-neutral-500 mt-1">24/09/2026</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 font-mono-code font-bold text-xs">
                                        #OS-2024-092
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-neutral-200">Subsolagem e Preparo de Solo</h4>
                                        <p className="text-[11px] text-neutral-400 mt-0.5">Talhão 08 • Operador: Marcos Vinícius</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/40">
                                        Em Execução
                                    </span>
                                    <span className="block text-[10px] font-mono-code text-neutral-500 mt-1">26/09/2026</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact & Financial Metadata */}
                <div className="space-y-6">
                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <User className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                Dados Cadastrais & Contato
                            </h2>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <span className="text-neutral-400 block mb-1">Razão Social / Nome</span>
                                <span className="font-semibold text-neutral-200 font-jakarta">{client.name}</span>
                            </div>

                            <div>
                                <span className="text-neutral-400 block mb-1">CNPJ / CPF</span>
                                <span className="font-mono-code font-semibold text-emerald-400">{client.document}</span>
                            </div>

                            <div>
                                <span className="text-neutral-400 block mb-1">E-mail Principal</span>
                                <span className="font-mono-code text-neutral-300">{client.email}</span>
                            </div>

                            <div>
                                <span className="text-neutral-400 block mb-1">Telefone de Contato</span>
                                <span className="font-mono-code text-neutral-300">{client.phone}</span>
                            </div>

                            <div>
                                <span className="text-neutral-400 block mb-1">Endereço Principal</span>
                                <span className="text-neutral-300 leading-relaxed">{client.address}</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-6 rounded-2xl border shadow-sm space-y-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: currentTheme.border }}>
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                Condições Comerciais
                            </h2>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Modalidade de Faturamento:</span>
                                <span className="font-semibold text-emerald-400">Safra / Por Hectare</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Prazo de Pagamento:</span>
                                <span className="font-mono-code text-neutral-200">30 dias pós-OS</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Limite de Crédito:</span>
                                <span className="font-mono-code font-bold text-emerald-400">R$ 150.000,00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
