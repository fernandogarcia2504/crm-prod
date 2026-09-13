export interface MonthlyBreakdownEntry {
    month: string;
    facturacion: number;
    objetivo: number;
}

export interface MonthSummary {
    label: string;
    total: number;
}

export interface FinanceSummary {
    goal: number;
    year: number;
    yearTotal: number;
    remaining: number;
    progressPercent: number;
    currentMonth: MonthSummary;
    previousMonth: MonthSummary | null;
    monthOverMonthChangePercent: number | null;
    averageTicket: number;
    monthlyBreakdown: MonthlyBreakdownEntry[];
}

export interface GetFinanceSummaryResponse {
    summary: FinanceSummary;
}
