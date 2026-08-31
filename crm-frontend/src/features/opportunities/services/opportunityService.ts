import type { Opportunity, CreateOpportunityData, CreateOpportunityResponse, UpdateOpportunityData, UpdateOpportunityResponse, GetOpportunitiesResponse, GetOpportunityResponse } from "../types/opportunity.types";

const API_URL = "https://crmprod-70ae5fa5478a.herokuapp.com/api/opportunities";

export const getOpportunities = async(companyId: string): Promise<Opportunity[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) {
        throw new Error (
            "Error al obtener todos los contactos de todas las empresas"
        )
    }

    const data: GetOpportunitiesResponse = await response.json()

    return data.opportunities
}

export const getOpportunity = async (opportunityId: string, companyId: string): Promise<Opportunity> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/${opportunityId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(
            "Error al obtener la empresa"
        );
    }

    const data: GetOpportunityResponse = await response.json();

    return data.opportunity;

}

export const createOpportunity = async (companyId: string, opportunityData: CreateOpportunityData): Promise<Opportunity> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(opportunityData)
    })

    const data: CreateOpportunityResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al crear la oportunidad"
        );
    }

    return data.opportunity;
}

export const updateOpportunity = async (companyId: string, opportunityId: string, opportunityData: UpdateOpportunityData ): Promise<Opportunity> => {

    const token = localStorage.getItem("token");

    const response = await fetch( `${API_URL}/${companyId}/${opportunityId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(opportunityData)
        }
    );

    const data: UpdateOpportunityResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al actualizar la empresa"
        );
    }

    return data.opportunity;
};
