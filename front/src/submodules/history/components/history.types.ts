export type OrderStatus = 'concluida' | 'cancelada';

export interface HistoryOrder {
    id: string;
    code: string; // ex: "OS #2024-8841"
    date: string; // ex: "24/10/2024, 14:32"
    operationName: string; // ex: "Colheita de Milho Safrinha"
    plotDetails: string; // ex: "Talhão 07 • Gleba Norte (142 ha)"
    clientName: string; // ex: "Agropecuária Santa Fé S.A."
    operatorName: string; // ex: "Carlos Mendes"
    equipment: string; // ex: "John Deere S770 • Frota #42"
    formattedHours: string; // ex: "42h 15m"
    cost: number; // ex: 1605.66
    status: OrderStatus;
}