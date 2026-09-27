import React, { useState, useMemo } from 'react';
import {
  Users,
  Tractor,
  Wrench,
  Search,
  Download,
  Plus,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  Database,
  XCircle,
  Sprout,
  ShieldCheck,
  UserCog,
  Sparkles,
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import { CollaboratorDetailsPage } from './CollaboratorDetailsPage';
import CollaboratorModal from '../../modals/collaboratorsModal/CollaboratorModal';
import type { CollaboratorFormData } from '../../modals/collaboratorsModal/collaborator.types';
import { ReportExportModal } from '../../modals/reportModal/ReportExportModal';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Operador de Máquinas' | 'Agrônomo/Técnico' | 'Mecânico' | 'Gestor' | 'Assistente';
  linkedMachine?: string;
  location: string;
  activeOS: number;
  status: 'active_field' | 'active_base' | 'vacation' | 'inactive';
  statusLabel: string;
  avatarBg: string;
}

export interface CollaboratorsPageProps {
  themeMode?: ThemeMode;
  onNewCollaborator?: () => void;
  onExportCSV?: () => void;
}

const roleTabs = [
  { id: 'all', label: 'Todos os Cargos' },
  { id: 'Operador de Máquinas', label: 'Operadores' },
  { id: 'Agrônomo/Técnico', label: 'Agrônomos' },
  { id: 'Mecânico', label: 'Mecânicos' },
  { id: 'Gestor', label: 'Gestores' },
  { id: 'Assistente', label: 'Assistentes' },
];

const ITEMS_PER_PAGE = 7;

export const CollaboratorsPage: React.FC<CollaboratorsPageProps> = ({
  themeMode = 'dark',
  onNewCollaborator,
  onExportCSV,
}) => {
  const currentTheme = colors[themeMode];

  // Filters & Selected Collaborator State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRoleTab, setSelectedRoleTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [forceEmptyState, setForceEmptyState] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [activePhoneMenuId, setActivePhoneMenuId] = useState<string | null>(null);

  // ESTADO DE CONTROLE DOS MODAIS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleSaveCollaborator = (formData: CollaboratorFormData) => {
    console.log('Dados financeiros e de cadastro prontos para enviar à API NestJS:', formData);
    setIsModalOpen(false);
  };

  // Mock Collaborators Dataset
  const allCollaborators: Collaborator[] = [
    {
      id: 'COL-001',
      name: 'Carlos Eduardo Santos',
      email: 'carlos.eduardo@morrogrande.com.br',
      phone: '(16) 9 9842-1040',
      role: 'Operador de Máquinas',
      linkedMachine: '#M-04 John Deere 7230J',
      location: 'Talhão 08 (Subsolagem)',
      activeOS: 2,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-emerald-600',
    },
    {
      id: 'COL-002',
      name: 'Marcos Vinícius Lima',
      email: 'marcos.vinicius@morrogrande.com.br',
      phone: '(16) 9 9711-3022',
      role: 'Operador de Máquinas',
      linkedMachine: '#M-07 Patriot 350',
      location: 'Talhão 04 (Pulverização)',
      activeOS: 1,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-blue-600',
    },
    {
      id: 'COL-003',
      name: 'Dr. Fernando Alcantara',
      email: 'fernando.agronomo@morrogrande.com.br',
      phone: '(16) 9 9620-8811',
      role: 'Agrônomo/Técnico',
      location: 'Setor Norte / Talhões 01 a 10',
      activeOS: 3,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-amber-600',
    },
    {
      id: 'COL-004',
      name: 'Roberto Souza Ferreira',
      email: 'roberto.souza@morrogrande.com.br',
      phone: '(16) 9 9104-5532',
      role: 'Operador de Máquinas',
      linkedMachine: '#M-11 Hercules 10000',
      location: 'Talhão 12 (Adubação)',
      activeOS: 1,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-indigo-600',
    },
    {
      id: 'COL-005',
      name: 'Antônio Silva Resende',
      email: 'antonio.silva@morrogrande.com.br',
      phone: '(16) 9 9340-7788',
      role: 'Operador de Máquinas',
      linkedMachine: '#M-02 Colheitadeira S790',
      location: 'Talhão 02 (Colheita)',
      activeOS: 2,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-[#2d7044]',
    },
    {
      id: 'COL-006',
      name: 'Mário Henrique Dias',
      email: 'mario.dias@morrogrande.com.br',
      phone: '(16) 9 9870-1122',
      role: 'Mecânico',
      location: 'Oficina Hangar Principal',
      activeOS: 4,
      status: 'active_base',
      statusLabel: 'Na Base',
      avatarBg: 'bg-purple-600',
    },
    {
      id: 'COL-007',
      name: 'Lucas Gabriel Oliveira',
      email: 'lucas.gabriel@morrogrande.com.br',
      phone: '(16) 9 9450-9900',
      role: 'Assistente',
      location: 'Escritório Central',
      activeOS: 0,
      status: 'active_base',
      statusLabel: 'Na Base',
      avatarBg: 'bg-pink-600',
    },
    {
      id: 'COL-008',
      name: 'Eng. Renata Guimarães',
      email: 'renata.agronoma@morrogrande.com.br',
      phone: '(16) 9 9230-4411',
      role: 'Agrônomo/Técnico',
      location: 'Setor Sul / Talhões 11 a 20',
      activeOS: 2,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-teal-600',
    },
    {
      id: 'COL-009',
      name: 'Paulo Cezar Mendonça',
      email: 'paulo.cezar@morrogrande.com.br',
      phone: '(16) 9 9812-7744',
      role: 'Operador de Máquinas',
      linkedMachine: '#M-05 Valtra T250',
      location: 'Talhão 15 (Gradagem)',
      activeOS: 1,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-cyan-600',
    },
    {
      id: 'COL-010',
      name: 'Fábio Alexandre Costa',
      email: 'fabio.costa@morrogrande.com.br',
      phone: '(16) 9 9789-2233',
      role: 'Gestor',
      location: 'Gerência Operacional',
      activeOS: 5,
      status: 'active_base',
      statusLabel: 'Na Base',
      avatarBg: 'bg-red-600',
    },
    {
      id: 'COL-011',
      name: 'Guilherme Augusto Ribeiro',
      email: 'guilherme.ribeiro@morrogrande.com.br',
      phone: '(16) 9 9678-5511',
      role: 'Mecânico',
      location: 'Oficina Móvel 02',
      activeOS: 2,
      status: 'active_field',
      statusLabel: 'Em Campo',
      avatarBg: 'bg-orange-600',
    },
    {
      id: 'COL-012',
      name: 'Juliano Barbosa Pires',
      email: 'juliano.pires@morrogrande.com.br',
      phone: '(16) 9 9512-3399',
      role: 'Operador de Máquinas',
      location: 'Licença Médica / Férias',
      activeOS: 0,
      status: 'vacation',
      statusLabel: 'Em Férias',
      avatarBg: 'bg-neutral-600',
    },
  ];

  // Filtering Logic
  const filteredCollaborators = useMemo(() => {
    if (forceEmptyState) return [];

    return allCollaborators.filter((col) => {
      const matchesSearch =
        col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (col.linkedMachine && col.linkedMachine.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'all' || col.status === selectedStatus;
      const matchesRole = selectedRoleTab === 'all' || col.role === selectedRoleTab;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [allCollaborators, searchQuery, selectedStatus, selectedRoleTab, forceEmptyState]);

  const totalPages = Math.ceil(filteredCollaborators.length / ITEMS_PER_PAGE) || 1;

  const paginatedCollaborators = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCollaborators.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCollaborators, currentPage]);

  const getRoleIcon = (role: Collaborator['role']) => {
    switch (role) {
      case 'Operador de Máquinas':
        return <Tractor className="w-4 h-4 shrink-0" style={{ color: currentTheme.primary }} />;
      case 'Agrônomo/Técnico':
        return <Sprout className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'Mecânico':
        return <Wrench className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'Gestor':
        return <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'Assistente':
        return <UserCog className="w-4 h-4 text-indigo-500 shrink-0" />;
      default:
        return <Users className="w-4 h-4 shrink-0" style={{ color: currentTheme.textMuted }} />;
    }
  };

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
    setSelectedRoleTab('all');
    setForceEmptyState(false);
  };

  // If a collaborator is selected, render full details page!
  if (selectedCollaborator) {
    return (
      <CollaboratorDetailsPage
        collaborator={selectedCollaborator}
        themeMode={themeMode}
        onBack={() => setSelectedCollaborator(null)}
        onEdit={(col) => alert(`Editar perfil de ${col.name}`)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-inter">
      {/* 1. Breadcrumb + Cabeçalho da Página & Botões de Ação */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: currentTheme.textSecondary }}>
          <span>Operações de Campo</span>
          <span>/</span>
          <span className="font-semibold" style={{ color: currentTheme.primary }}>Recursos Humanos</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold font-jakarta tracking-tight"
              style={{ color: currentTheme.textPrimary }}
            >
              Colaboradores
            </h1>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold border"
              style={{
                backgroundColor: currentTheme.badgeSuccess.bg,
                color: currentTheme.badgeSuccess.text,
                borderColor: currentTheme.badgeSuccess.border,
              }}
            >
              {allCollaborators.length} Cadastrados
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onExportCSV) onExportCSV();
                setIsReportModalOpen(true);
              }}
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
              onClick={() => {
                if (onNewCollaborator) onNewCollaborator();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-sm hover:shadow-md"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Plus className="w-4 h-4" />
              <span>Novo Colaborador</span>
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
            <span className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: currentTheme.textSecondary }}>Total de Colaboradores</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>{allCollaborators.length}</span>
              <span className="text-xs font-medium" style={{ color: currentTheme.badgeSuccess.text }}>100% ativos</span>
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
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: currentTheme.textSecondary }}>Em Campo (Operação)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.badgeSuccess.text }}>8</span>
              <span className="text-xs" style={{ color: currentTheme.textMuted }}>Em talhões</span>
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
            <Tractor className="w-5 h-5" />
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: currentTheme.textSecondary }}>Técnicos & Agrônomos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.badgeInfo.text }}>3</span>
              <span className="text-xs" style={{ color: currentTheme.textMuted }}>Supervisão</span>
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
            <Sprout className="w-5 h-5" />
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: currentTheme.textSecondary }}>Suporte & Mecânica</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.badgeWarning.text }}>4</span>
              <span className="text-xs" style={{ color: currentTheme.textMuted }}>Oficina & Manutenção</span>
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
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Barra de Busca & Filtros */}
      <div
        className="p-4 rounded-2xl border shadow-2xs space-y-4 transition-colors"
        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
      >
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textMuted }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setForceEmptyState(false);
              }}
              placeholder="Buscar por nome, e-mail, cargo ou equipamento..."
              className="w-full pl-10 pr-12 py-2 rounded-xl text-xs border transition-all focus:outline-none"
              style={{
                backgroundColor: currentTheme.inputBg,
                borderColor: currentTheme.inputBorder,
                color: currentTheme.inputText,
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setForceEmptyState(false);
                }}
                className="px-3 py-2 pr-8 rounded-xl text-xs font-medium border appearance-none cursor-pointer focus:outline-none"
                style={{
                  backgroundColor: currentTheme.dropdownBg,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary,
                }}
              >
                <option value="all">Todos os Status</option>
                <option value="active_field">Em Campo</option>
                <option value="active_base">Na Base</option>
                <option value="vacation">Em Férias</option>
                <option value="inactive">Inativo</option>
              </select>
              <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
            </div>

            <button
              type="button"
              onClick={() => setForceEmptyState(!forceEmptyState)}
              className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
              style={
                forceEmptyState
                  ? {
                        backgroundColor: currentTheme.badgeWarning.bg,
                        borderColor: currentTheme.badgeWarning.border,
                        color: currentTheme.badgeWarning.text,
                    }
                  : {
                        backgroundColor: currentTheme.surfaceSecondary,
                        borderColor: currentTheme.border,
                        color: currentTheme.textSecondary,
                    }
              }
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              {forceEmptyState ? 'Restaurar Dados' : 'Simular Vazio'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t pt-3" style={{ borderColor: currentTheme.border }}>
          {roleTabs.map((tab) => {
            const isActive = selectedRoleTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedRoleTab(tab.id);
                  setForceEmptyState(false);
                }}
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
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Listagem em Tabela */}
      {filteredCollaborators.length === 0 ? (
        <div
          className="p-12 rounded-2xl border text-center flex flex-col items-center justify-center space-y-4 transition-colors"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div
            className="p-4 rounded-full border"
            style={{
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border,
              color: currentTheme.textMuted,
            }}
          >
            <XCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
              Nenhum colaborador encontrado
            </h3>
            <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
              Não encontramos nenhum registro que corresponda aos filtros de busca atuais. Tente ajustar os termos ou restaurar a lista.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Limpar Filtros de Busca
          </button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div
            className="rounded-2xl border overflow-hidden shadow-2xs transition-colors"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
          >
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
                  <th className="py-3.5 px-4 font-jakarta">Colaborador</th>
                  <th className="py-3.5 px-4 font-jakarta">Cargo & Função</th>
                  <th className="py-3.5 px-4 font-jakarta">Contato & Talhão</th>
                  <th className="py-3.5 px-4 font-jakarta text-center">OS Ativas</th>
                  <th className="py-3.5 px-4 font-jakarta">Status</th>
                  <th className="py-3.5 px-4 font-jakarta text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                {paginatedCollaborators.map((col) => {
                  const cleanPhone = col.phone.replace(/\D/g, '');

                  const statusStyle =
                    col.status === 'active_field'
                      ? currentTheme.badgeSuccess
                      : col.status === 'active_base'
                      ? currentTheme.badgeInfo
                      : col.status === 'vacation'
                      ? currentTheme.badgeWarning
                      : currentTheme.badgeNeutral;

                  return (
                    <tr
                      key={col.id}
                      onClick={() => setSelectedCollaborator(col)}
                      className="transition-colors cursor-pointer hover:opacity-90"
                      style={{ borderBottomColor: currentTheme.border }}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${col.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border border-white/10`}>
                            {getInitials(col.name)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-xs tracking-tight truncate" style={{ color: currentTheme.textPrimary }}>
                              {col.name}
                            </span>
                            <span className="text-[11px] font-mono-code truncate" style={{ color: currentTheme.textSecondary }}>{col.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(col.role)}
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs" style={{ color: currentTheme.textPrimary }}>{col.role}</span>
                            {col.linkedMachine ? (
                              <span className="text-[11px] font-mono-code font-medium" style={{ color: currentTheme.badgeSuccess.text }}>{col.linkedMachine}</span>
                            ) : (
                              <span className="text-[11px]" style={{ color: currentTheme.textMuted }}>Sem máquina fixa</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5" style={{ color: currentTheme.textPrimary }}>
                            <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.textMuted }} />
                            <span className="font-mono-code text-[11px]">{col.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5" style={{ color: currentTheme.textSecondary }}>
                            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                            <span className="text-[11px] truncate max-w-[180px]">{col.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {col.activeOS > 0 ? (
                          <span
                            className="inline-flex items-center gap-1 font-mono-code font-bold text-xs px-2.5 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: currentTheme.badgeInfo.bg,
                              color: currentTheme.badgeInfo.text,
                              borderColor: currentTheme.badgeInfo.border,
                            }}
                          >
                            <FileText className="w-3 h-3" />
                            {col.activeOS} OS
                          </span>
                        ) : (
                          <span className="text-[11px]" style={{ color: currentTheme.textMuted }}>-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            borderColor: statusStyle.border,
                          }}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${col.status === 'active_field' ? 'animate-pulse' : ''}`}
                            style={{ backgroundColor: statusStyle.text }}
                          />
                          {col.statusLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 relative">
                          {/* Botão Telefone com Dropdown Popover */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePhoneMenuId((prev) => (prev === col.id ? null : col.id));
                              }}
                              className="p-2 rounded-xl border transition-all cursor-pointer shadow-xs"
                              style={{
                                backgroundColor: currentTheme.surface,
                                borderColor: currentTheme.border,
                                color: currentTheme.textSecondary,
                              }}
                              title="Opções de Contato (Ligar, WhatsApp, E-mail)"
                            >
                              <Phone className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu de Contato */}
                            {activePhoneMenuId === col.id && (
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
                                    href={`tel:${cleanPhone}`}
                                    onClick={() => setActivePhoneMenuId(null)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
                                    style={{ color: currentTheme.textPrimary }}
                                  >
                                    <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.primary }} />
                                    <span>Ligar</span>
                                  </a>

                                  <a
                                    href={`https://wa.me/55${cleanPhone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setActivePhoneMenuId(null)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
                                    style={{ color: currentTheme.badgeSuccess.text }}
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.badgeSuccess.text }} />
                                    <span>WhatsApp</span>
                                  </a>

                                  <a
                                    href={`mailto:${col.email}`}
                                    onClick={() => setActivePhoneMenuId(null)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors"
                                    style={{ color: currentTheme.badgeInfo.text }}
                                  >
                                    <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: currentTheme.badgeInfo.text }} />
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
                              setSelectedCollaborator(col);
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
                })}
              </tbody>
            </table>
          </div>

          <div
            className="p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors mt-4"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
          >
            <div className="flex items-center gap-3">
              <span style={{ color: currentTheme.textSecondary }}>
                Mostrando <strong className="font-mono-code" style={{ color: currentTheme.textPrimary }}>
                  {filteredCollaborators.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCollaborators.length)}
                </strong> de{' '}
                <strong className="font-mono-code" style={{ color: currentTheme.textPrimary }}>{filteredCollaborators.length}</strong> colaboradores
              </span>
              <span className="hidden sm:inline" style={{ color: currentTheme.textMuted }}>•</span>
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium"
                style={{
                  backgroundColor: currentTheme.badgeSuccess.bg,
                  color: currentTheme.badgeSuccess.text,
                  borderColor: currentTheme.badgeSuccess.border,
                }}
              >
                <Database className="w-3 h-3" style={{ color: currentTheme.badgeSuccess.text }} />
                <span>Supabase Conectado</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textSecondary,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                className="px-3 py-1 rounded-lg text-white font-semibold font-mono-code text-xs"
                style={{ backgroundColor: currentTheme.primary }}
              >
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textSecondary,
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDERIZAÇÃO DOS MODAIS */}
      <CollaboratorModal
        isOpen={isModalOpen}
        themeMode={themeMode}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCollaborator}
      />

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