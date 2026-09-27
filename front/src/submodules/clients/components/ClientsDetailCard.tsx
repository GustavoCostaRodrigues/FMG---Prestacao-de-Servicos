import React from 'react';
import {
    X,
    Pencil,
    Phone,
    Mail,
    MessageSquare,
    Building2,
    Calendar,
    Radio,
    MapPin
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import type { Client } from './ClientsPage';

export interface ClientDetailCardProps {
    client: Client;
    themeMode?: ThemeMode;
    onClose: () => void;
    onEdit?: (client: Client) => void;
}

export const ClientDetailCard: React.FC<ClientDetailCardProps> = ({
    client,
    themeMode = 'dark',
    onClose,
    onEdit,
}) => {
    const currentTheme = colors[themeMode];
    const isDark = themeMode === 'dark';

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const cleanPhone = client.phone.replace(/\D/g, '');

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
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d7044]">
                        Detalhes do Cliente
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(client)}
                            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Editar Perfil"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Fechar Detalhes"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-none">
                {/* 2. Informações Principais (Avatar Grande, Nome, Documento, Botões de Contato) */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                        <div
                            className={`w-20 h-20 rounded-full ${client.avatarBg} text-white font-bold text-xl flex items-center justify-center shadow-md border-2 border-emerald-500/30`}
                        >
                            {getInitials(client.name)}
                        </div>
                        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
                    </div>

                    <h3
                        className="text-lg font-bold font-jakarta tracking-tight"
                        style={{ color: currentTheme.textPrimary }}
                    >
                        {client.name}
                    </h3>

                    <span className="text-xs font-semibold text-[#2d7044] mt-0.5">
                        Cliente Ativo • Safra 24/25
                    </span>

                    <span className="text-[11px] font-mono-code text-neutral-400 mt-1">
                        CNPJ/CPF: {client.document}
                    </span>

                    {/* Botões de Ação Rápida de Contato */}
                    <div className="flex items-center gap-2 mt-4 w-full">
                        <a
                            href={`tel:${cleanPhone}`}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isDark
                                    ? 'bg-neutral-800/80 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                                    : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
                                }`}
                        >
                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Ligar</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => alert(`Iniciando conversa no WhatsApp com ${client.phone}...`)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isDark
                                    ? 'bg-neutral-800/80 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                                    : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
                                }`}
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                            <span>WhatsApp</span>
                        </button>

                        <a
                            href={`mailto:${client.email}`}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${isDark
                                    ? 'bg-neutral-800/80 border-neutral-700 text-neutral-200 hover:bg-neutral-700'
                                    : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
                                }`}
                        >
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                            <span>E-mail</span>
                        </a>
                    </div>
                </div>

                {/* 3. Informações de Endereço & Sede */}
                <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Endereço & Sede Logística
                    </span>
                    <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-2.5 text-xs">
                        <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-neutral-300 leading-snug">{client.address}</span>
                    </div>
                </div>

                {/* 4. Estabelecimentos Vinculados */}
                <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: currentTheme.border }}>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                            Estabelecimentos ({client.establishments.length})
                        </span>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {client.establishments.length === 0 ? (
                            <p className="text-xs text-neutral-500 italic py-3 text-center bg-neutral-900/30 rounded-xl border border-neutral-800/60">
                                Nenhum estabelecimento vinculado.
                            </p>
                        ) : (
                            client.establishments.map((est) => (
                                <div
                                    key={est.id}
                                    className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                                        }`}
                                >
                                    <span className="font-semibold text-xs text-neutral-200 block">{est.name}</span>
                                    <span className="text-[11px] text-neutral-400 block">{est.details}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 5. Rodapé do Card: Data de Cadastro e Status de Sincronização */}
            <div
                className="px-5 py-3 border-t flex items-center justify-between text-[11px] text-neutral-400 font-mono-code"
                style={{ borderColor: currentTheme.border }}
            >
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>Cadastrado: 14/01/2023</span>
                </div>

                <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-500" />
                    <span>Sync OK</span>
                </div>
            </div>
        </aside>
    );
};