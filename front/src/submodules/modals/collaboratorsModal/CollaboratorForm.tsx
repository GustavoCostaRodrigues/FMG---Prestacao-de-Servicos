import React, { useState } from 'react';
import {
    User,
    DollarSign,
    X,
    ArrowRight,
    ArrowLeft,
    Check,
    BadgeCheck,
    Briefcase,
    Phone,
    Mail,
    FileText,
    Calculator,
} from 'lucide-react';
import type { CollaboratorFormData, ContractType } from './collaborator.types';
import { colors, type ThemeMode } from '../../../styles/theme';

interface CollaboratorFormProps {
    themeMode?: ThemeMode;
    onClose: () => void;
    onSubmit: (data: CollaboratorFormData) => void;
}

export const CollaboratorForm: React.FC<CollaboratorFormProps> = ({
    themeMode = 'dark',
    onClose,
    onSubmit,
}) => {
    const currentTheme = colors[themeMode];

    const [activeTab, setActiveTab] = useState<'identificacao' | 'custos'>('identificacao');

    // Estados do formulário
    const [formData, setFormData] = useState<CollaboratorFormData>({
        fullName: '',
        corporateEmail: '',
        contactPhone: '',
        docType: 'cpf',
        fiscalDoc: '',
        jobRole: '',
        baseSalary: 4500,
        workloadHours: 220,
        contractType: 'CLT',
        chargesPercentage: 68.0,
        benefitsCost: 850,
    });

    // Funções de Cálculo de HH e Custo Total
    const chargesAmount = formData.baseSalary * (formData.chargesPercentage / 100);
    const totalMonthlyCost = formData.baseSalary + chargesAmount + formData.benefitsCost;
    const costPerHour = formData.workloadHours > 0 ? totalMonthlyCost / formData.workloadHours : 0;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleContractChange = (contract: ContractType) => {
        let defaultCharges = 68.0;
        if (contract === 'PJ') defaultCharges = 0.0;
        else if (contract === 'Safra') defaultCharges = 52.0;
        else if (contract === 'Horista') defaultCharges = 72.5;

        setFormData(prev => ({
            ...prev,
            contractType: contract,
            chargesPercentage: defaultCharges,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div
            className="w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative max-h-[90vh] border transition-colors font-inter"
            style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary,
            }}
        >
            {/* Accent Top Border */}
            <div className="h-1 w-full" style={{ backgroundColor: currentTheme.primary }}></div>

            {/* Header */}
            <header
                className="px-6 py-4 flex items-center justify-between gap-4 border-b relative z-10 transition-colors"
                style={{
                    backgroundColor: currentTheme.background,
                    borderColor: currentTheme.border,
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                        style={{
                            backgroundColor: currentTheme.iconBoxSuccess.bg,
                            borderColor: currentTheme.iconBoxSuccess.border,
                        }}
                    >
                        <BadgeCheck className="w-5 h-5" style={{ color: currentTheme.iconBoxSuccess.text }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-base font-bold font-jakarta" style={{ color: currentTheme.textPrimary }}>
                                Novo Colaborador
                            </h1>
                            <span
                                className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide"
                                style={{
                                    backgroundColor: currentTheme.badgeSuccess.bg,
                                    borderColor: currentTheme.badgeSuccess.border,
                                    color: currentTheme.badgeSuccess.text,
                                }}
                            >
                                Safra 24/25
                            </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: currentTheme.textSecondary }}>
                            Cadastro operacional e parametrização financeira de Homem-Hora
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-colors"
                        style={{
                            backgroundColor: currentTheme.surface,
                            borderColor: currentTheme.border,
                        }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
                            Custo HH
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs font-bold font-mono-code" style={{ color: currentTheme.primary }}>
                                {formatCurrency(costPerHour)}
                            </span>
                            <span className="text-[10px]" style={{ color: currentTheme.textSecondary }}>
                                /h
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg transition-colors cursor-pointer hover:opacity-80"
                        style={{ color: currentTheme.textSecondary }}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Tab Switcher */}
            <div
                className="px-6 pt-4 pb-2 flex items-center justify-between border-b transition-colors"
                style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                }}
            >
                <div
                    className="flex items-center gap-2 p-1 rounded-xl border transition-colors"
                    style={{
                        backgroundColor: currentTheme.surfaceSecondary,
                        borderColor: currentTheme.border,
                    }}
                >
                    <button
                        onClick={() => setActiveTab('identificacao')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all cursor-pointer shadow-xs font-semibold"
                        style={
                            activeTab === 'identificacao'
                                ? { backgroundColor: currentTheme.primary, color: '#ffffff' }
                                : { color: currentTheme.textSecondary }
                        }
                        type="button"
                    >
                        <User className="w-4 h-4" />
                        <span>1. Identificação & Cargo</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('custos')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all cursor-pointer shadow-xs font-semibold"
                        style={
                            activeTab === 'custos'
                                ? { backgroundColor: currentTheme.primary, color: '#ffffff' }
                                : { color: currentTheme.textSecondary }
                        }
                        type="button"
                    >
                        <DollarSign className="w-4 h-4" />
                        <span>2. Contrato & Custos (HH)</span>
                    </button>
                </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} id="collaborator-form" className="overflow-y-auto p-6 space-y-6 flex-1">
                {/* TAB 1 */}
                <div className={`space-y-5 ${activeTab !== 'identificacao' ? 'hidden' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                Nome Completo <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="ex: Carlos Silveira Mendes"
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border focus:outline-none text-xs transition-all"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                E-mail Corporativo <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
                                <input
                                    type="email"
                                    required
                                    value={formData.corporateEmail}
                                    onChange={e => setFormData({ ...formData, corporateEmail: e.target.value })}
                                    placeholder="carlos.mendes@morrogrande.com.br"
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border focus:outline-none text-xs transition-all font-mono-code"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                Telefone / WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
                                <input
                                    type="text"
                                    required
                                    value={formData.contactPhone}
                                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                    placeholder="(16) 99781-4420"
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border focus:outline-none text-xs transition-all font-mono-code"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                    Documento Fiscal
                                </label>
                                <div
                                    className="flex items-center gap-1 p-0.5 rounded-lg border transition-colors"
                                    style={{
                                        backgroundColor: currentTheme.surfaceSecondary,
                                        borderColor: currentTheme.border,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, docType: 'cpf' })}
                                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md transition-all cursor-pointer"
                                        style={
                                            formData.docType === 'cpf'
                                                ? { backgroundColor: currentTheme.primary, color: '#ffffff' }
                                                : { color: currentTheme.textSecondary }
                                        }
                                    >
                                        CPF
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, docType: 'cnpj' })}
                                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md transition-all cursor-pointer"
                                        style={
                                            formData.docType === 'cnpj'
                                                ? { backgroundColor: currentTheme.primary, color: '#ffffff' }
                                                : { color: currentTheme.textSecondary }
                                        }
                                    >
                                        CNPJ
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
                                <input
                                    type="text"
                                    value={formData.fiscalDoc}
                                    onChange={e => setFormData({ ...formData, fiscalDoc: e.target.value })}
                                    placeholder={formData.docType === 'cpf' ? '123.456.789-00' : '12.345.678/0001-90'}
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border focus:outline-none text-xs transition-all font-mono-code"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                Cargo & Atribuição Operacional <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: currentTheme.textMuted }} />
                                <select
                                    required
                                    value={formData.jobRole}
                                    onChange={e => setFormData({ ...formData, jobRole: e.target.value })}
                                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border focus:outline-none text-xs transition-all cursor-pointer appearance-none"
                                    style={{
                                        backgroundColor: currentTheme.inputBg,
                                        borderColor: currentTheme.inputBorder,
                                        color: currentTheme.inputText,
                                    }}
                                >
                                    <option value="" disabled style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textSecondary }}>
                                        Selecione o cargo...
                                    </option>
                                    <option value="operador_maquinas" style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textPrimary }}>
                                        Operador de Máquinas (Sênior / Pleno / Júnior)
                                    </option>
                                    <option value="engenheiro_agronomo" style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textPrimary }}>
                                        Engenheiro Agrônomo / Técnico RT
                                    </option>
                                    <option value="mecanico_manutencao" style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textPrimary }}>
                                        Mecânico de Manutenção & Oficina
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TAB 2 */}
                <div className={`space-y-5 ${activeTab !== 'custos' ? 'hidden' : ''}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                Salário Base Bruto (R$) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.baseSalary}
                                onChange={e => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-xs font-mono-code"
                                style={{
                                    backgroundColor: currentTheme.inputBg,
                                    borderColor: currentTheme.inputBorder,
                                    color: currentTheme.inputText,
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>
                                Carga Horária Mensal (h) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.workloadHours}
                                onChange={e => setFormData({ ...formData, workloadHours: parseFloat(e.target.value) || 1 })}
                                className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-xs font-mono-code"
                                style={{
                                    backgroundColor: currentTheme.inputBg,
                                    borderColor: currentTheme.inputBorder,
                                    color: currentTheme.inputText,
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Regime de Contratação</label>
                            <select
                                value={formData.contractType}
                                onChange={e => handleContractChange(e.target.value as ContractType)}
                                className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-xs cursor-pointer"
                                style={{
                                    backgroundColor: currentTheme.inputBg,
                                    borderColor: currentTheme.inputBorder,
                                    color: currentTheme.inputText,
                                }}
                            >
                                <option value="CLT" style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textPrimary }}>CLT</option>
                                <option value="PJ" style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textPrimary }}>PJ</option>
                                <option value="Horista" style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textPrimary }}>Horista</option>
                                <option value="Safra" style={{ backgroundColor: currentTheme.dropdownBg, color: currentTheme.textPrimary }}>Safra</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Encargos Sociais & Provisões (%)</label>
                            <input
                                type="number"
                                value={formData.chargesPercentage}
                                onChange={e => setFormData({ ...formData, chargesPercentage: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-xs font-mono-code"
                                style={{
                                    backgroundColor: currentTheme.inputBg,
                                    borderColor: currentTheme.inputBorder,
                                    color: currentTheme.inputText,
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold" style={{ color: currentTheme.textPrimary }}>Benefícios Fixos Mensais (R$)</label>
                            <input
                                type="number"
                                value={formData.benefitsCost}
                                onChange={e => setFormData({ ...formData, benefitsCost: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-xs font-mono-code"
                                style={{
                                    backgroundColor: currentTheme.inputBg,
                                    borderColor: currentTheme.inputBorder,
                                    color: currentTheme.inputText,
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-xl border flex items-center justify-between transition-colors"
                        style={{
                            backgroundColor: currentTheme.surfaceSecondary,
                            borderColor: currentTheme.border,
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 rounded-lg border flex items-center justify-center"
                                style={{
                                    backgroundColor: currentTheme.iconBoxSuccess.bg,
                                    borderColor: currentTheme.iconBoxSuccess.border,
                                    color: currentTheme.iconBoxSuccess.text,
                                }}
                            >
                                <Calculator className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-wider block font-semibold" style={{ color: currentTheme.textSecondary }}>
                                    Custo Total Empresa / Mês
                                </span>
                                <span className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                                    Salário + Encargos + Benefícios
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold font-mono-code" style={{ color: currentTheme.primary }}>{formatCurrency(totalMonthlyCost)}</span>
                        </div>
                    </div>
                </div>
            </form>

            {/* Footer */}
            <footer
                className="px-6 py-4 flex items-center justify-between gap-3 border-t shrink-0 transition-colors"
                style={{
                    backgroundColor: currentTheme.background,
                    borderColor: currentTheme.border,
                }}
            >
                <button
                    onClick={onClose}
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer hover:opacity-80"
                    style={{ color: currentTheme.textSecondary }}
                >
                    Cancelar
                </button>

                <div className="flex items-center gap-3">
                    {activeTab === 'identificacao' ? (
                        <button
                            type="button"
                            onClick={() => setActiveTab('custos')}
                            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border hover:opacity-90"
                            style={{
                                backgroundColor: currentTheme.surface,
                                borderColor: currentTheme.border,
                                color: currentTheme.textPrimary,
                            }}
                        >
                            <span>Avançar para Custos</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setActiveTab('identificacao')}
                                className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border hover:opacity-90"
                                style={{
                                    backgroundColor: currentTheme.surface,
                                    borderColor: currentTheme.border,
                                    color: currentTheme.textPrimary,
                                }}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Voltar</span>
                            </button>

                            <button
                                type="submit"
                                form="collaborator-form"
                                className="px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-90"
                                style={{
                                    backgroundColor: currentTheme.primary,
                                    color: '#ffffff',
                                }}
                            >
                                <Check className="w-4 h-4" />
                                <span>Salvar Colaborador</span>
                            </button>
                        </>
                    )}
                </div>
            </footer>
        </div>
    );
};