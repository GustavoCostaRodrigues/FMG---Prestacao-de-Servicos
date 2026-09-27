import React from 'react';
import {
  X,
  Pencil,
  Phone,
  Mail,
  MessageSquare,
  Check,
  XCircle,
  Clock,
  Calendar,
  Radio,
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import type { Collaborator } from './CollaboratorsPage';

export interface CollaboratorDetailCardProps {
  collaborator: Collaborator;
  themeMode?: ThemeMode;
  onClose: () => void;
  onEdit?: (collaborator: Collaborator) => void;
}

export const CollaboratorDetailCard: React.FC<CollaboratorDetailCardProps> = ({
  collaborator,
  themeMode = 'dark',
  onClose,
  onEdit,
}) => {
  const currentTheme = colors[themeMode];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <aside
      className="w-full lg:w-96 rounded-2xl border shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 animate-in slide-in-from-right-4"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.border,
        color: currentTheme.textPrimary,
      }}
    >
      {/* 1. Header do Card: Status Dot + Título + Ações (Editar, Fechar) */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: currentTheme.border }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.success }} />
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.primary }}>
            Perfil do Colaborador
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(collaborator)}
              className="p-1.5 rounded-lg transition-colors cursor-pointer hover:opacity-80"
              style={{ color: currentTheme.textSecondary }}
              title="Editar Perfil"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:opacity-80"
            style={{ color: currentTheme.textSecondary }}
            title="Fechar Detalhes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo com Scroll */}
      <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
        {/* 2. Informações Principais do Colaborador (Avatar Grande, Nome, ID, Botões de Contato) */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div
              className={`w-20 h-20 rounded-full ${collaborator.avatarBg} text-white font-bold text-xl flex items-center justify-center shadow-md border-2`}
              style={{ borderColor: currentTheme.border }}
            >
              {getInitials(collaborator.name)}
            </div>
            <span
              className="absolute bottom-1 right-1 w-3.5 h-3.5 border-2 rounded-full"
              style={{ backgroundColor: currentTheme.success, borderColor: currentTheme.surface }}
            />
          </div>

          <h3
            className="text-lg font-bold font-jakarta tracking-tight"
            style={{ color: currentTheme.textPrimary }}
          >
            {collaborator.name}
          </h3>

          <span className="text-xs font-semibold mt-0.5" style={{ color: currentTheme.primary }}>
            {collaborator.role} Sênior
          </span>

          <span className="text-[11px] font-mono-code mt-1" style={{ color: currentTheme.textMuted }}>
            ID: 88Aa2-sb-morro-grande
          </span>

          {/* Botões de Ação Rápida de Contato */}
          <div className="flex items-center gap-2 mt-4 w-full">
            <a
              href={`tel:${collaborator.phone.replace(/\D/g, '')}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary,
              }}
            >
              <Phone className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span>Ligar</span>
            </a>

            <button
              type="button"
              onClick={() => alert(`Iniciando conversa no WhatsApp com ${collaborator.phone}...`)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary,
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
              <span>WhatsApp</span>
            </button>

            <a
              href={`mailto:${collaborator.email}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary,
              }}
            >
              <Mail className="w-3.5 h-3.5" style={{ color: currentTheme.info }} />
              <span>E-mail</span>
            </a>
          </div>
        </div>

        {/* 3. Permissões de Sistema (USER_ROLES) */}
        <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: currentTheme.border }}>
          <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: currentTheme.textMuted }}>
            Permissões de Sistema (USER_ROLES)
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1">
              <span style={{ color: currentTheme.textSecondary }}>Nível de Acesso</span>
              <span
                className="font-mono-code font-bold text-[11px] px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: currentTheme.badgeSuccess.bg,
                  color: currentTheme.badgeSuccess.text,
                  borderColor: currentTheme.badgeSuccess.border,
                }}
              >
                Operacional Campo
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span style={{ color: currentTheme.textSecondary }}>Telemetria em Tempo Real</span>
              <span
                className="p-1 rounded-full"
                style={{
                  backgroundColor: currentTheme.badgeSuccess.bg,
                  color: currentTheme.badgeSuccess.text,
                }}
              >
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span style={{ color: currentTheme.textSecondary }}>Abertura / Encerramento OS</span>
              <span
                className="p-1 rounded-full"
                style={{
                  backgroundColor: currentTheme.badgeSuccess.bg,
                  color: currentTheme.badgeSuccess.text,
                }}
              >
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span style={{ color: currentTheme.textSecondary }}>Módulo Financeiro</span>
              <span
                className="p-1 rounded-full"
                style={{
                  backgroundColor: currentTheme.badgeNeutral.bg,
                  color: currentTheme.badgeNeutral.text,
                }}
              >
                <XCircle className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* 5. OS Recentes (2 em Andamento) */}
        <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: currentTheme.border }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
              OS Recentes (2 em Andamento)
            </span>
            <span className="text-[11px] flex items-center gap-1 font-mono-code" style={{ color: currentTheme.textMuted }}>
              <Clock className="w-3 h-3" />
              Hoje
            </span>
          </div>

          <div className="space-y-2.5">
            {/* OS 1 */}
            <div
              className="p-3 rounded-xl border space-y-2"
              style={{
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
              }}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-code font-bold text-xs" style={{ color: currentTheme.primary }}>
                  #OS-2024-884 • Colheita Grãos
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: currentTheme.badgeSuccess.bg,
                    color: currentTheme.badgeSuccess.text,
                    borderColor: currentTheme.badgeSuccess.border,
                  }}
                >
                  84% Concluído
                </span>
              </div>

              <p className="text-[11px]" style={{ color: currentTheme.textSecondary }}>
                Gleba Norte • Talhão 07 • Alvo: 140 ha
              </p>

              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.border }}>
                <div className="h-full rounded-full" style={{ width: '84%', backgroundColor: currentTheme.primary }} />
              </div>
            </div>

            {/* OS 2 */}
            <div
              className="p-3 rounded-xl border flex items-center justify-between text-xs"
              style={{
                backgroundColor: currentTheme.surfaceSecondary,
                borderColor: currentTheme.border,
              }}
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-mono-code font-bold text-xs" style={{ color: currentTheme.textPrimary }}>
                  #OS-2024-890 • Revisão Pós-Turno
                </span>
                <span className="text-[11px] mt-0.5 truncate" style={{ color: currentTheme.textSecondary }}>
                  Checklist de lubrificação e facas de corte
                </span>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded shrink-0 border"
                style={{
                  backgroundColor: currentTheme.badgeNeutral.bg,
                  color: currentTheme.badgeNeutral.text,
                  borderColor: currentTheme.badgeNeutral.border,
                }}
              >
                Agendada 18:00
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Rodapé do Card: Admissão e Último Sync */}
      <div
        className="px-5 py-3 border-t flex items-center justify-between text-[11px] font-mono-code"
        style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}
      >
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" style={{ color: currentTheme.textMuted }} />
          <span>Admissão: 14/03/2021</span>
        </div>

        <div className="flex items-center gap-1">
          <Radio className="w-3 h-3" style={{ color: currentTheme.primary }} />
          <span>Último sync: há 4 min</span>
        </div>
      </div>
    </aside>
  );
};
