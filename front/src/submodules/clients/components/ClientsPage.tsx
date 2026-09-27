import React, { useState, useMemo } from 'react';
import {
    Users,
    Search,
    Download,
    Plus,
    Phone,
    Mail,
    MessageSquare,
    ArrowRight,
    FileText,
    Building2,
    MapPinned,
    FolderKanban,
    Sparkles,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import ClientModal from '../../modals/clientsModal/ClientModal';
import { ClientDetailsPage } from './ClientDetailsPage';
import { ReportExportModal } from '../../modals/reportModal/ReportExportModal';

export interface Establishment {
    id: string;
    name: string;
    details: string;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    document: string;
    address: string;
    establishmentsCount: number;
    activeOS: number;
    status: 'active' | 'prospect' | 'inactive';
    avatarBg: string;
    establishments: Establishment[];
}

export interface ClientsPageProps {
    themeMode?: ThemeMode;
    onExportCSV?: () => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({
    themeMode = 'dark',
    onExportCSV,
}) => {
    const currentTheme = colors[themeMode];
    const isDark = themeMode === 'dark';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [forceEmptyState, setForceEmptyState] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [activePhoneMenuId, setActivePhoneMenuId] = useState<string | null>(null);

    const [clients, setClients] = useState<Client[]>([
        {
            id: 'CLI-001',
            name: 'Agropecuária Santa Fé S.A.',
            email: 'contato@agropecuariasantafe.com.br',
            phone: '(16) 9 9742-8810',
            document: '14.892.304/0001-82',
            address: 'Rodovia SP-330, Km 312 - Ribeirão Preto / SP',
            establishmentsCount: 4,
            activeOS: 3,
            status: 'active',
            avatarBg: 'bg-emerald-600',
            establishments: [
                { id: 'est_1', name: 'Fazenda Santa Fé - Sede', details: '1.450 ha • Grãos / Milho e Soja' },
                { id: 'est_2', name: 'Fazenda Bela Vista', details: '820 ha • Cana-de-açúcar' },
            ],
        },
        {
            id: 'CLI-002',
            name: 'Cooperativa Vale Verde',
            email: 'operacoes@valeverde.coop.br',
            phone: '(16) 9 9823-1102',
            document: '08.431.902/0001-15',
            address: 'Av. Agroindustrial, 1200 - Sertãozinho / SP',
            establishmentsCount: 6,
            activeOS: 2,
            status: 'active',
            avatarBg: 'bg-blue-600',
            establishments: [
                { id: 'est_3', name: 'Unidade Central Vale Verde', details: 'Armazém Geral e Recepção' },
            ],
        },
        {
            id: 'CLI-003',
            name: 'Grupo Fazendas Reunidas',
            email: 'administracao@fazendasreunidas.com.br',
            phone: '(17) 99650-8891',
            document: '22.109.832/0001-44',
            address: 'Rodovia Brigadeiro Faria Lima, Km 428 - Barretos / SP',
            establishmentsCount: 8,
            activeOS: 4,
            status: 'active',
            avatarBg: 'bg-amber-600',
            establishments: [],
        },
        {
            id: 'CLI-004',
            name: 'Fazenda Vista Alegre',
            email: 'roberto.junqueira@vistaalegre.agr.br',
            phone: '(16) 99709-1234',
            document: '098.765.432-11',
            address: 'Estrada Municipal Batatais-Brodowski, Km 8 - Batatais / SP',
            establishmentsCount: 1,
            activeOS: 0,
            status: 'prospect',
            avatarBg: 'bg-indigo-600',
            establishments: [],
        },
    ]);

    const handleSaveNewClient = (newClientData: { name: string; document: string; email: string; phone: string; address: string }) => {
        const newClient: Client = {
            id: `CLI-00${clients.length + 1}`,
            name: newClientData.name,
            email: newClientData.email,
            phone: newClientData.phone,
            document: newClientData.document,
            address: newClientData.address || 'Endereço não informado',
            establishmentsCount: 1,
            activeOS: 0,
            status: 'active',
            avatarBg: 'bg-teal-600',
            establishments: [],
        };
        setClients([newClient, ...clients]);
        setSelectedClient(newClient);
    };

    const filteredClients = useMemo(() => {
        if (forceEmptyState) return [];

        return clients.filter((cli) => {
            const matchesSearch =
                cli.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cli.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cli.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cli.address.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = selectedStatus === 'all' || cli.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [clients, searchQuery, selectedStatus, forceEmptyState]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('all');
        setForceEmptyState(false);
    };

    // If a client is selected, render the full Details screen!
    if (selectedClient) {
        return (
            <ClientDetailsPage
                client={selectedClient}
                themeMode={themeMode}
                onBack={() => setSelectedClient(null)}
                onEdit={(c) => alert(`Editar cliente: ${c.name}`)}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300 font-inter">
            {/* 1. Breadcrumb + Cabeçalho da Página */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <span>Gestão Agrícola</span>
                    <span>/</span>
                    <span className="text-emerald-500 font-semibold">Clientes & Contratos</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                    <div className="flex items-center gap-3">
                        <h1
                            className="text-2xl font-bold font-jakarta tracking-tight"
                            style={{ color: currentTheme.textPrimary }}
                        >
                            Clientes
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${isDark
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}>
                            {clients.length} Cadastrados
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                if (onExportCSV) onExportCSV();
                                setIsReportModalOpen(true);
                            }}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${isDark
                                ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200'
                                : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                                }`}
                        >
                            <Download className="w-4 h-4 text-neutral-400" />
                            <span>Gerar Relatório</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2d7044] hover:bg-[#255d38] transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Novo Cliente</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Barra de Estatísticas / KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border shadow-2xs flex items-center justify-between" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">Total de Clientes</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>{clients.length}</span>
                            <span className="text-xs text-emerald-500 font-medium">Base Ativa</span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        <Users className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl border shadow-2xs flex items-center justify-between" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">Estabelecimentos</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-emerald-500">19</span>
                            <span className="text-xs text-neutral-400">Propriedades</span>
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark
                            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/30'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                        <Building2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl border shadow-2xs flex items-center justify-between" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">OS Ativas em Clientes</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-blue-400">9</span>
                            <span className="text-xs text-neutral-400">Ordens de serviço</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-950/50 text-blue-400 border border-blue-800/30">
                        <FolderKanban className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl border shadow-2xs flex items-center justify-between" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">Área Coberta</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-jakarta text-amber-400">6.470 ha</span>
                            <span className="text-xs text-neutral-400">Atendidos</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-950/50 text-amber-400 border border-amber-800/30">
                        <MapPinned className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* 3. Barra de Busca e Filtros */}
            <div className="p-4 rounded-2xl border shadow-2xs space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setForceEmptyState(false);
                            }}
                            placeholder="Buscar por razão social, CNPJ/CPF, e-mail ou endereço..."
                            className={`w-full pl-10 pr-12 py-2 rounded-xl text-xs border transition-all focus:outline-none focus:ring-2 focus:ring-[#2d7044]/40 ${isDark ? 'bg-neutral-900/80 border-neutral-700 text-white placeholder-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                                }`}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setForceEmptyState(false);
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2d7044]/40 ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-700'
                                }`}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativo</option>
                            <option value="prospect">Em Prospecção</option>
                            <option value="inactive">Inativo</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => setForceEmptyState(!forceEmptyState)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${forceEmptyState ? 'bg-amber-950/80 border-amber-700 text-amber-300' : isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-neutral-200' : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                                }`}
                        >
                            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                            {forceEmptyState ? 'Restaurar Dados' : 'Simular Vazio'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Listagem em Tabela */}
            {filteredClients.length === 0 ? (
                <div className="p-12 rounded-2xl border text-center flex flex-col items-center justify-center space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <div className="p-4 rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-400">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <div className="max-w-md space-y-1">
                        <h3 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>Nenhum cliente encontrado</h3>
                        <p className="text-xs text-neutral-400">Não encontramos registros correspondentes à busca. Tente ajustar os filtros.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2d7044] text-white hover:bg-[#255d38] transition-all cursor-pointer"
                    >
                        Limpar Filtros de Busca
                    </button>
                </div>
            ) : (
                <div className="w-full space-y-4">
                    <div className="rounded-2xl border overflow-hidden shadow-2xs" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b uppercase tracking-wider text-[11px] font-semibold text-neutral-400" style={{ backgroundColor: isDark ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 0.8)', borderColor: currentTheme.border }}>
                                    <th className="py-3.5 px-4 font-jakarta">Razão Social / Cliente</th>
                                    <th className="py-3.5 px-4 font-jakarta">Documento & Endereço</th>
                                    <th className="py-3.5 px-4 font-jakarta">Contato</th>
                                    <th className="py-3.5 px-4 font-jakarta text-center">Locais</th>
                                    <th className="py-3.5 px-4 font-jakarta text-center">OS Ativas</th>
                                    <th className="py-3.5 px-4 font-jakarta text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                                {filteredClients.map((cli) => {
                                    const cleanPhone = cli.phone.replace(/\D/g, '');
                                    return (
                                        <tr
                                            key={cli.id}
                                            onClick={() => setSelectedClient(cli)}
                                            className={`transition-all cursor-pointer ${isDark ? 'hover:bg-neutral-800/40' : 'hover:bg-neutral-50'
                                                }`}
                                        >
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full ${cli.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/10`}>
                                                        {getInitials(cli.name)}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold text-xs tracking-tight truncate" style={{ color: currentTheme.textPrimary }}>
                                                            {cli.name}
                                                        </span>
                                                        <span className="text-[11px] font-mono-code text-neutral-400 truncate">{cli.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex flex-col">
                                                    <span className="font-mono-code text-[11px] font-semibold text-emerald-400">{cli.document}</span>
                                                    <span className="text-[11px] text-neutral-400 truncate max-w-[200px]">{cli.address}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5 text-neutral-300">
                                                    <Phone className="w-3 h-3 text-neutral-400 shrink-0" />
                                                    <span className="font-mono-code text-[11px]">{cli.phone}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className="font-mono-code text-xs px-2.5 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700">
                                                    {cli.establishmentsCount} un.
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                {cli.activeOS > 0 ? (
                                                    <span className="inline-flex items-center gap-1 font-mono-code font-bold text-xs px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/30">
                                                        <FileText className="w-3 h-3" />
                                                        {cli.activeOS} OS
                                                    </span>
                                                ) : (
                                                    <span className="text-neutral-500 text-[11px]">-</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5 relative">
                                                    {/* Botão Telefone com Dropdown Popover */}
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActivePhoneMenuId((prev) => (prev === cli.id ? null : cli.id));
                                                            }}
                                                            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs ${activePhoneMenuId === cli.id
                                                                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400'
                                                                : isDark
                                                                    ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                                                                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                                                }`}
                                                            title="Opções de Contato (Ligar, WhatsApp, E-mail)"
                                                        >
                                                            <Phone className="w-4 h-4 text-emerald-400" />
                                                        </button>

                                                        {/* Dropdown Menu de Contato */}
                                                        {activePhoneMenuId === cli.id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-20"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActivePhoneMenuId(null);
                                                                    }}
                                                                />
                                                                <div
                                                                    className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl z-30 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 text-left ${isDark
                                                                        ? 'bg-neutral-900/95 border-neutral-700 text-neutral-200 backdrop-blur-md'
                                                                        : 'bg-white/95 border-neutral-200 text-neutral-800 backdrop-blur-md'
                                                                        }`}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-1 mb-1">
                                                                        Opções de Contato
                                                                    </div>

                                                                    <a
                                                                        href={`tel:${cleanPhone}`}
                                                                        onClick={() => setActivePhoneMenuId(null)}
                                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-neutral-800/80 transition-colors text-neutral-200 hover:text-white"
                                                                    >
                                                                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                                        <span>Ligar</span>
                                                                    </a>

                                                                    <a
                                                                        href={`https://wa.me/55${cleanPhone}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        onClick={() => setActivePhoneMenuId(null)}
                                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-emerald-950/40 text-emerald-400 hover:text-emerald-300 transition-colors"
                                                                    >
                                                                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                                        <span>WhatsApp</span>
                                                                    </a>

                                                                    <a
                                                                        href={`mailto:${cli.email}`}
                                                                        onClick={() => setActivePhoneMenuId(null)}
                                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium hover:bg-neutral-800/80 transition-colors text-blue-400 hover:text-blue-300"
                                                                    >
                                                                        <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                                        <span>Enviar E-mail</span>
                                                                    </a>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Botão Seta (Abrir Tela de Detalhes) */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedClient(cli);
                                                        }}
                                                        className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs ${isDark
                                                            ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-[#2d7044] hover:border-[#2d7044] hover:text-white'
                                                            : 'bg-white border-neutral-200 text-neutral-600 hover:bg-[#2d7044] hover:border-[#2d7044] hover:text-white'
                                                            }`}
                                                        title="Abrir Tela de Detalhes"
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Rodapé e Paginação Padrão */}
                    <div
                        className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors mt-4"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                        <span style={{ color: currentTheme.textSecondary }}>
                            Mostrando <strong className="font-mono-code" style={{ color: currentTheme.textPrimary }}>{filteredClients.length}</strong> de <strong className="font-mono-code" style={{ color: currentTheme.textPrimary }}>{clients.length}</strong> clientes cadastrados
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled
                                className={`p-1.5 rounded-lg border text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 rounded-lg bg-[#2d7044] text-white font-semibold font-mono-code text-xs">
                                Página 1 de 1
                            </span>
                            <button
                                type="button"
                                disabled
                                className={`p-1.5 rounded-lg border text-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cadastro */}
            <ClientModal
                isOpen={isModalOpen}
                themeMode={themeMode}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveNewClient}
            />

            {/* Modal de Relatório */}
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