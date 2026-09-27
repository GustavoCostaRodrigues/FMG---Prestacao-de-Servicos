export type ContractType = 'CLT' | 'PJ' | 'Horista' | 'Safra';

export interface CollaboratorFormData {
    fullName: string;
    corporateEmail: string;
    contactPhone: string;
    docType: 'cpf' | 'cnpj';
    fiscalDoc: string;
    jobRole: string;
    baseSalary: number;
    workloadHours: number;
    contractType: ContractType;
    chargesPercentage: number;
    benefitsCost: number;
}