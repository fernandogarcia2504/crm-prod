import { useEffect, useState } from "react";

import { getOpportunities, createOpportunity as createOpportunityService, updateOpportunity as updateOpportunityService } from "../services/opportunityService";

import type { Opportunity, CreateOpportunityData, UpdateOpportunityData } from "../types/opportunity.types";

export function useOpportunities(companyId: string | null) {

    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!companyId) {
            setOpportunities([]);
            return
        }

        const fetchOpportunities = async () => {
            try {
                setLoading(true);
                setError(null)

                const data = await getOpportunities(companyId);

                setOpportunities(data)

                console.log(data)
            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener las oportunidades de la empresa" );

            } finally {

                setLoading(false);

            }
        } 
        
        fetchOpportunities();
    }, [companyId])

    const createOpportunity = async (opportunityData: CreateOpportunityData) => {
        
        if(!companyId) {
            throw new Error("No existe un cliente seleccionado")
        }

        const newOpportunity = await createOpportunityService( companyId, opportunityData);

        setOpportunities((currentOpportunities) => [
            ...currentOpportunities,
            newOpportunity
        ])

        return newOpportunity
    };

    const updateOpportunity = async ( opportunityId: string, opportunityData: UpdateOpportunityData) => {
        
        if (!companyId) {
            throw new Error( "No existe el cliente seleccionado" );
        }

        const updatedOpportunity = await updateOpportunityService(
            companyId,
            opportunityId,
            opportunityData
        );

        setOpportunities((currentOpportunities) =>
            currentOpportunities.map((opportunity) =>
                opportunity._id === opportunityId
                    ? updatedOpportunity
                    : opportunity
            )
        );

        return updatedOpportunity;

    };

    // Reemplaza una oportunidad en el estado local sin volver a pedirla
    // al backend. Se usa cuando otra operación (p. ej. crear una actividad
    // que cambia la etapa a "Ganado") ya devuelve la oportunidad actualizada.
    const syncOpportunity = (updatedOpportunity: Opportunity) => {

        setOpportunities((currentOpportunities) =>
            currentOpportunities.map((opportunity) =>
                opportunity._id === updatedOpportunity._id
                    ? updatedOpportunity
                    : opportunity
            )
        );
    };

    return {
        opportunities,
        loading,
        error,
        createOpportunity,
        updateOpportunity,
        syncOpportunity
    }

}