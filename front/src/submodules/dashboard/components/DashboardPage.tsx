import React, { useState } from 'react';
import {
  Download,
  Plus,
  TrendingUp,
  Wrench,
  AlertTriangle,
  Tractor,
  Clock,
  Fuel,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Radio,
  Building2,
  DollarSign,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';

export interface DashboardPageProps {
  themeMode?: ThemeMode;
  onNewWorkOrder?: () => void;
  onGenerateReport?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  themeMode = 'light',
  onNewWorkOrder,
  onGenerateReport,
}) => {
  const currentTheme = colors[themeMode];
  const isDark = themeMode === 'dark';
  const [taskFilter, setTaskFilter] = useState<'all' | 'in_progress' | 'scheduled' | 'delayed'>('all');

  // Agenda Operacional / OS Tasks Mock Data
  const agendaTasks = [
    {
      id: 'OS #1042',
      time: '07:30',
      title: 'Preparo de Solo & Subsolagem',
      location: 'Talhão 08 (120 ha)',
      operator: 'Carlos Eduardo',
      machine: '#M-04',
      machineName: 'Trator John Deere 7230J',
      status: 'in_progress',
      statusLabel: 'Em Andamento',
    },
    {
      id: 'OS #1043',
      time: '09:00',
      title: 'Pulverização Defensivo Agrícola',
      location: 'Talhão 04 (85 ha)',
      operator: 'Marcos Vinícius',
      machine: '#M-07',
      machineName: 'Pulverizador Patriot 350',
      status: 'delayed',
      statusLabel: 'Atrasada',
      note: 'Mangueira com vazamento na oficina',
    },
    {
      id: 'OS #1044',
      time: '13:30',
      title: 'Adubação de Cobertura NPK',
      location: 'Talhão 12 (150 ha)',
      operator: 'Roberto Souza',
      machine: '#M-11',
      machineName: 'Distribuidor Hercules 10000',
      status: 'scheduled',
      statusLabel: 'Agendada',
    },
    {
      id: 'OS #1045',
      time: '15:00',
      title: 'Colheita de Milho Safrinha',
      location: 'Talhão 02 (200 ha)',
      operator: 'Antônio Silva',
      machine: '#M-02',
      machineName: 'Colheitadeira S790',
      status: 'scheduled',
      statusLabel: 'Agendada',
    },
  ];

  const filteredTasks = agendaTasks.filter((task) => {
    if (taskFilter === 'all') return true;
    return task.status === taskFilter;
  });

  // Frota em Operação Mock Data
  const fleetVehicles = [
    {
      id: '#M-04',
      name: 'Trator John Deere 7230J',
      type: 'Trator de Pneu',
      status: 'Em Campo',
      statusType: 'active',
      horimeter: '1.420 h',
      fuelLevel: 78,
      operator: 'Carlos Eduardo',
    },
    {
      id: '#M-07',
      name: 'Pulverizador Patriot 350',
      type: 'Autopropelido',
      status: 'Manutenção',
      statusType: 'maintenance',
      horimeter: '890 h',
      fuelLevel: 45,
      operator: 'Oficina Hangar',
    },
    {
      id: '#M-11',
      name: 'Distribuidor Hercules 10000',
      type: 'Adubador',
      status: 'Pronto',
      statusType: 'ready',
      horimeter: '640 h',
      fuelLevel: 92,
      operator: 'Roberto Souza',
    },
    {
      id: '#M-02',
      name: 'Colheitadeira S790',
      type: 'Colheitadeira',
      status: 'Em Campo',
      statusType: 'active',
      horimeter: '2.150 h',
      fuelLevel: 60,
      operator: 'Antônio Silva',
    },
  ];

  // Clientes Principais Mock Data
  const topClients = [
    { name: 'Agropecuária Santa Fé', revenue: 'R$ 184.200', share: 38, growth: '+12.4%' },
    { name: 'Cooperativa Vale Verde', revenue: 'R$ 142.800', share: 30, growth: '+8.1%' },
    { name: 'Grãos & Cia Exportadora', revenue: 'R$ 98.450', share: 20, growth: '+15.0%' },
    { name: 'Usina Alvorada S.A.', revenue: 'R$ 57.200', share: 12, growth: '+4.3%' },
  ];

  // Fluxo Financeiro por Semanas
  const weeklyRevenue = [
    { week: 'Sem 1', amount: 110000, height: '65%' },
    { week: 'Sem 2', amount: 135000, height: '80%' },
    { week: 'Sem 3', amount: 145000, height: '90%' },
    { week: 'Sem 4', amount: 92650, height: '55%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-inter">
      {/* 1. Breadcrumb + Cabeçalho da Página & Botões de Ação */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
          <span>Visão Geral</span>
          <span>/</span>
          <span className="text-emerald-500 font-semibold">Painel Operacional</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold font-jakarta tracking-tight"
              style={{ color: currentTheme.textPrimary }}
            >
              Painel Operacional
            </h1>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold font-mono-code border"
              style={{
                backgroundColor: currentTheme.badgeSuccess.bg,
                color: currentTheme.badgeSuccess.text,
                borderColor: currentTheme.badgeSuccess.border,
              }}
            >
              SAFRA 2024/2025
            </span>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Botão Relatório (Secundário Minimalista) */}
            <button
              type="button"
              onClick={onGenerateReport}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${isDark
                ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-neutral-200'
                : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
            >
              <Download className="w-4 h-4 text-neutral-400" />
              <span>Exportar Relatório</span>
            </button>

            {/* Botão Nova Ordem de Serviço (Principal Verde Oficial) */}
            <button
              type="button"
              onClick={onNewWorkOrder}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2d7044] hover:bg-[#255d38] transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Ordem de Serviço</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Seção de 4 KPIs Essenciais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Faturamento Mês */}
        <div
          className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Faturamento Mês
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                R$ 482.650
              </span>
              <span className="text-xs font-semibold text-emerald-500">+14.2%</span>
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
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Ordens de Serviço */}
        <div
          className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Ordens de Serviço
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta text-blue-500">
                28
              </span>
              <span className="text-xs text-neutral-400">12 em Campo</span>
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
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Pendências & Atrasos */}
        <div
          className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Pendências & Alertas
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta text-amber-500">
                3
              </span>
              <span className="text-xs text-neutral-400">Atrasos Oficina</span>
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
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Frota Operacional */}
        <div
          className="p-4 rounded-2xl border shadow-2xs transition-all flex items-center justify-between"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 block mb-1">
              Frota Operacional
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-jakarta text-emerald-500">
                82%
              </span>
              <span className="text-xs text-neutral-400">18/22 Operando</span>
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
      </div>

      {/* 3. Grade Principal Dividida em Duas Colunas (8 Colunas Esquerda / 4 Colunas Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA (8 colunas no desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Seção 1: Agenda Operacional (Lista Diária de Tarefas/OS) */}
          <div
            className="p-4 rounded-2xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3
                  className="text-base font-bold font-jakarta"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Agenda Operacional do Dia
                </h3>
                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                  Tarefas e ordens de serviço programadas para hoje
                </p>
              </div>

              {/* Filtros da Agenda */}
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: currentTheme.surfaceSecondary }}>
                <button
                  type="button"
                  onClick={() => setTaskFilter('all')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: taskFilter === 'all' ? currentTheme.surface : 'transparent',
                    color: taskFilter === 'all' ? currentTheme.textPrimary : currentTheme.textSecondary,
                  }}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('in_progress')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: taskFilter === 'in_progress' ? currentTheme.surface : 'transparent',
                    color: taskFilter === 'in_progress' ? currentTheme.primary : currentTheme.textSecondary,
                  }}
                >
                  Em Andamento
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('delayed')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: taskFilter === 'delayed' ? currentTheme.surface : 'transparent',
                    color: taskFilter === 'delayed' ? currentTheme.warning : currentTheme.textSecondary,
                  }}
                >
                  Atrasadas
                </button>
              </div>
            </div>

            {/* Lista de Atividades / OS */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border transition-all"
                  style={{
                    backgroundColor: currentTheme.surfaceSecondary,
                    borderColor: currentTheme.border,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {/* Horário */}
                      <div
                        className="flex items-center gap-1 text-xs font-bold font-mono-code px-2.5 py-1 rounded-lg shrink-0 border"
                        style={{
                          backgroundColor: currentTheme.surface,
                          color: currentTheme.textPrimary,
                          borderColor: currentTheme.border,
                        }}
                      >
                        <Clock className="w-3 h-3 text-neutral-400" />
                        {task.time}
                      </div>

                      {/* Informações da Tarefa */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono-code font-semibold" style={{ color: currentTheme.primary }}>{task.id}</span>
                          <h4 className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>
                            {task.title}
                          </h4>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: currentTheme.textSecondary }}>
                          {task.location} • Operador: <strong className="font-medium" style={{ color: currentTheme.textPrimary }}>{task.operator}</strong>
                        </p>
                        {task.note && (
                          <span className="inline-block mt-1 text-[11px] font-medium" style={{ color: currentTheme.badgeWarning.text }}>
                            ⚠️ {task.note}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lado Direito: Máquina + Badge de Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
                      <span
                        className="text-xs font-mono-code px-2 py-0.5 rounded-md border"
                        style={{
                          backgroundColor: currentTheme.surface,
                          color: currentTheme.textSecondary,
                          borderColor: currentTheme.border,
                        }}
                      >
                        {task.machine}
                      </span>

                      {/* Status Badge */}
                      {task.status === 'in_progress' && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{
                            backgroundColor: currentTheme.badgeSuccess.bg,
                            color: currentTheme.badgeSuccess.text,
                            borderColor: currentTheme.badgeSuccess.border,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {task.statusLabel}
                        </span>
                      )}

                      {task.status === 'delayed' && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{
                            backgroundColor: currentTheme.badgeWarning.bg,
                            color: currentTheme.badgeWarning.text,
                            borderColor: currentTheme.badgeWarning.border,
                          }}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {task.statusLabel}
                        </span>
                      )}

                      {task.status === 'scheduled' && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{
                            backgroundColor: currentTheme.badgeInfo.bg,
                            color: currentTheme.badgeInfo.text,
                            borderColor: currentTheme.badgeInfo.border,
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {task.statusLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 2: Frota em Operação (Grade de Cards Minimalistas) */}
          <div
            className="p-4 rounded-2xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-base font-bold font-jakarta"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Frota em Operação
                </h3>
                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                  Status dos maquinários principais, horímetros e combustível
                </p>
              </div>

              <button
                type="button"
                className="text-xs font-semibold text-[#2d7044] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ver Frota Completa
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid de Maquinários */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fleetVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-neutral-800/30' : 'bg-neutral-50/50'
                    }`}
                  style={{ borderColor: currentTheme.border }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono-code text-[#2d7044]">{vehicle.id}</span>
                      <h5 className="text-xs font-bold tracking-tight" style={{ color: currentTheme.textPrimary }}>
                        {vehicle.name}
                      </h5>
                    </div>

                    {/* Status Pill */}
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                      style={
                        vehicle.statusType === 'active'
                          ? { backgroundColor: currentTheme.badgeSuccess.bg, color: currentTheme.badgeSuccess.text, borderColor: currentTheme.badgeSuccess.border }
                          : vehicle.statusType === 'maintenance'
                          ? { backgroundColor: currentTheme.badgeWarning.bg, color: currentTheme.badgeWarning.text, borderColor: currentTheme.badgeWarning.border }
                          : { backgroundColor: currentTheme.badgeInfo.bg, color: currentTheme.badgeInfo.text, borderColor: currentTheme.badgeInfo.border }
                      }
                    >
                      {vehicle.status}
                    </span>
                  </div>

                  <p className="text-[11px] mb-3" style={{ color: currentTheme.textSecondary }}>
                    {vehicle.type} • Resp: <span className="font-medium" style={{ color: currentTheme.textPrimary }}>{vehicle.operator}</span>
                  </p>

                  {/* Horímetro & Combustível */}
                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t" style={{ borderColor: currentTheme.border }}>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-0.5">
                        Horímetro
                      </span>
                      <span className="text-xs font-bold font-mono-code" style={{ color: currentTheme.textPrimary }}>
                        {vehicle.horimeter}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-neutral-400" />
                          Tanque
                        </span>
                        <span className="font-mono-code font-bold" style={{ color: currentTheme.textPrimary }}>
                          {vehicle.fuelLevel}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.surfaceSecondary }}>
                        <div
                          className={`h-full rounded-full ${vehicle.fuelLevel > 50
                            ? 'bg-emerald-500'
                            : vehicle.fuelLevel > 20
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (4 colunas no desktop - Painel Lateral) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Resultado do Mês / Fluxo Financeiro */}
          <div
            className="p-4 rounded-2xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-base font-bold font-jakarta"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Fluxo Financeiro
                </h3>
                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                  Receitas x Custos no mês corrente
                </p>
              </div>
              <DollarSign className="w-4 h-4 text-[#2d7044]" />
            </div>

            {/* Bar Chart Minimalista */}
            <div className="my-4 pt-4 pb-2 px-2 border-b flex items-end justify-between gap-3 h-32" style={{ borderColor: currentTheme.border }}>
              {weeklyRevenue.map((w, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono-code opacity-0 group-hover:opacity-100 transition-opacity font-semibold" style={{ color: currentTheme.textSecondary }}>
                    R$ {(w.amount / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full bg-[#2d7044] rounded-t-lg transition-all group-hover:bg-[#255d38]"
                    style={{ height: w.height }}
                  />
                  <span className="text-[11px] font-medium text-neutral-500">
                    {w.week}
                  </span>
                </div>
              ))}
            </div>

            {/* Linhas de Balanço Financeiro */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span style={{ color: currentTheme.textSecondary }}>Total Faturado:</span>
                <span className="font-bold font-mono-code" style={{ color: currentTheme.textPrimary }}>
                  R$ 482.650
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span style={{ color: currentTheme.textSecondary }}>Custos Diretos:</span>
                <span className="font-bold font-mono-code" style={{ color: currentTheme.badgeDanger.text }}>
                  - R$ 214.300
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t font-semibold" style={{ borderColor: currentTheme.border }}>
                <span style={{ color: currentTheme.primary }}>Resultado Líquido:</span>
                <span className="inline-flex items-center gap-1 font-bold font-mono-code" style={{ color: currentTheme.primary }}>
                  R$ 268.350
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Clientes Principais */}
          <div
            className="p-4 rounded-2xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.border,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-base font-bold font-jakarta"
                  style={{ color: currentTheme.textPrimary }}
                >
                  Clientes Principais
                </h3>
                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                  Maiores parceiros comerciais em volume
                </p>
              </div>
              <Building2 className="w-4 h-4 text-neutral-400" />
            </div>

            {/* Lista Compacta de Clientes */}
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between text-xs pb-2 border-b last:border-b-0" style={{ borderColor: currentTheme.border }}>
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold block truncate" style={{ color: currentTheme.textPrimary }}>
                      {client.name}
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: currentTheme.primary }}>
                      {client.growth} este mês
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold font-mono-code block" style={{ color: currentTheme.textPrimary }}>
                      {client.revenue}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {client.share}% do total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Status de Conectividade (Rodapé Lateral Discreto) */}
          <div
            className="p-4 rounded-2xl border shadow-2xs transition-colors"
            style={{
              backgroundColor: currentTheme.surfaceSecondary,
              borderColor: currentTheme.border,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Conectividade Campo
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block">Gateway Sede</span>
                  <span className="font-bold text-[11px]" style={{ color: currentTheme.primary }}>Online 99.8%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block">Canal Rádio</span>
                  <span className="font-bold text-[11px]" style={{ color: currentTheme.info }}>Canal 04 (154.25)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
