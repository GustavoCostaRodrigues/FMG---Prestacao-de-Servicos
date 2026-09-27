import React, { useState } from 'react';
import {
    X,
    Building2,
    ShieldCheck,
    PhoneCall,
    MapPin,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';

interface ClientModalProps {
    isOpen: boolean;
    themeMode?: ThemeMode;
    onClose: () => void;
    onSubmit: (clientData: {
        name: string;
        document: string;
        email: string;
        phone: string;
        address: string;
    }) => void;
}

export default function ClientModal({
    isOpen,
    themeMode = 'dark',
    onClose,
    onSubmit,
}: ClientModalProps) {
    const currentTheme = colors[themeMode];
    const isDark = themeMode === 'dark';

    const [isCnpj, setIsCnpj] = useState(true);
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, '');
        if (isCnpj) {
            if (v.length > 14) v = v.substring(0, 14);
            v = v.replace(/^(\d{2})(\d)/, '$1.$2');
            v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
            v = v.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            if (v.length > 11) v = v.substring(0, 11);
            v = v.replace(/^(\d{3})(\d)/, '$1.$2');
            v = v.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
            v = v.replace(/\.(\d{3})(\d)/, '.$1-$2');
        }
        setDocument(v);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 2) v = '(' + v.substring(0, 2) + ') ' + v.substring(2);
        if (v.length > 10) v = v.substring(0, 10) + '-' + v.substring(10);
        setPhone(v);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !document || !email) return;

        setLoading(true);
        setTimeout(() => {
            onSubmit({ name, document, email, phone, address });
            setLoading(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#070a0e]/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300 font-inter">
            <div
                className="w-full md:max-w-3xl rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[88vh] overflow-hidden relative border transition-colors"
                style={{
                    backgroundColor: currentTheme.surface,
                    color: currentTheme.textPrimary,
                    borderColor: currentTheme.border,
                }}
            >
                {/* Accent Top Border */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-600/40 via-emerald-600 to-emerald-400"></div>

                {/* Modal Header */}
                <div
                    className="px-6 py-4 flex items-center justify-between gap-4 border-b relative z-10 transition-colors"
                    style={{
                        backgroundColor: currentTheme.background,
                        borderColor: currentTheme.border,
                    }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs"
                            style={{
                                backgroundColor: isDark ? 'rgba(45, 112, 68, 0.15)' : 'rgba(45, 112, 68, 0.1)',
                                borderColor: currentTheme.border,
                                color: '#2d7044',
                            }}
                        >
                            <Building2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base font-bold font-jakarta tracking-tight" style={{ color: currentTheme.textPrimary }}>
                                    Novo Cliente
                                </h2>
                                <span
                                    className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border text-emerald-500"
                                    style={{
                                        backgroundColor: isDark ? 'rgba(45, 112, 68, 0.15)' : 'rgba(45, 112, 68, 0.1)',
                                        borderColor: currentTheme.border,
                                    }}
                                >
                                    Safra 24/25
                                </span>
                            </div>
                            <p className="text-xs truncate mt-0.5" style={{ color: currentTheme.textSecondary }}>
                                Cadastro fiscal, canais de contato e telemetria para ordens de serviço.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl transition-colors cursor-pointer border hover:opacity-80"
                        style={{
                            backgroundColor: currentTheme.background,
                            borderColor: currentTheme.border,
                            color: currentTheme.textSecondary,
                        }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} id="clientFormModal" className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
                    {/* Seção 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs uppercase tracking-wider font-bold" style={{ color: currentTheme.textPrimary }}>
                                    1. Identificação Básica & Fiscal
                                </span>
                            </div>
                            <span className="text-[11px]" style={{ color: currentTheme.textSecondary }}>* Campos Obrigatórios</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-7 flex flex-col gap-1.5">
                                <label className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    Razão Social / Nome Completo <span className="text-emerald-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="ex: Agropecuária Santa Fé S.A."
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                    style={{
                                        backgroundColor: currentTheme.surface,
                                        borderColor: currentTheme.border,
                                        color: currentTheme.textPrimary,
                                    }}
                                />
                            </div>

                            <div className="md:col-span-5 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                        Documento <span className="text-emerald-500">*</span>
                                    </label>
                                    <div
                                        className="flex items-center p-0.5 rounded-lg border transition-colors"
                                        style={{
                                            backgroundColor: currentTheme.surface,
                                            borderColor: currentTheme.border,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => { setIsCnpj(true); setDocument(''); }}
                                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${isCnpj ? 'bg-[#2d7044] text-white' : ''
                                                }`}
                                            style={!isCnpj ? { color: currentTheme.textSecondary } : {}}
                                        >
                                            CNPJ
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setIsCnpj(false); setDocument(''); }}
                                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${!isCnpj ? 'bg-[#2d7044] text-white' : ''
                                                }`}
                                            style={isCnpj ? { color: currentTheme.textSecondary } : {}}
                                        >
                                            CPF
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={document}
                                    onChange={handleDocumentChange}
                                    placeholder={isCnpj ? '00.000.000/0001-00' : '000.000.000-00'}
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono-code transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                    style={{
                                        backgroundColor: currentTheme.surface,
                                        borderColor: currentTheme.border,
                                        color: currentTheme.textPrimary,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção 2 */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                            <PhoneCall className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs uppercase tracking-wider font-bold" style={{ color: currentTheme.textPrimary }}>
                                2. Canais de Contato & Gestão de O.S.
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    E-mail Corporativo <span className="text-emerald-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="contato@agropecuariasantafe.com.br"
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                    style={{
                                        backgroundColor: currentTheme.surface,
                                        borderColor: currentTheme.border,
                                        color: currentTheme.textPrimary,
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    Telefone / WhatsApp <span className="text-emerald-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="(16) 99742-8810"
                                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono-code transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                    style={{
                                        backgroundColor: currentTheme.surface,
                                        borderColor: currentTheme.border,
                                        color: currentTheme.textPrimary,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção 3 */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: currentTheme.border }}>
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs uppercase tracking-wider font-bold" style={{ color: currentTheme.textPrimary }}>
                                3. Endereço Principal & Sede Logística
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Endereço Principal</label>
                            <textarea
                                rows={2}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="ex: Rodovia SP-330, Km 312 - Ribeirão Preto / SP"
                                className="w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                }}
                            />
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div
                    className="px-6 py-4 border-t flex items-center justify-end gap-3 shrink-0 transition-colors"
                    style={{
                        backgroundColor: currentTheme.background,
                        borderColor: currentTheme.border,
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer hover:opacity-80"
                        style={{ color: currentTheme.textSecondary }}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        form="clientFormModal"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl bg-[#2d7044] hover:bg-[#255d38] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{loading ? 'Gravando...' : 'Salvar Cliente'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}