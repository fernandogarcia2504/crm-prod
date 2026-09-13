import type { FinanceSummary, GetFinanceSummaryResponse } from "../types/finance.types";

const API_URL = "https://crmprod-70ae5fa5478a.herokuapp.com/api/finances";

export const getFinanceSummary = async (businessId: string): Promise<FinanceSummary> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${businessId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(
            "Error al obtener el resumen financiero"
        );
    }

    const data: GetFinanceSummaryResponse = await response.json();

    return data.summary;
}
