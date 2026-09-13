import { useEffect, useState } from "react";

import { getFinanceSummary } from "../services/financeService";

import type { FinanceSummary } from "../types/finance.types";

export function useFinanceSummary(businessId: string | null) {

    const [summary, setSummary] = useState<FinanceSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!businessId) {
            setSummary(null);
            return;
        }

        const fetchSummary = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getFinanceSummary(businessId);

                setSummary(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener el resumen financiero" );

            } finally {

                setLoading(false);

            }
        };

        fetchSummary();

    }, [businessId]);

    return {
        summary,
        loading,
        error
    };
}
