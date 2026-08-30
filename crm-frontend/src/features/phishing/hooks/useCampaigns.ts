import { useEffect, useState } from "react";

import {
    getCampaigns,
    createCampaign as createCampaignService,
    deleteCampaign as deleteCampaignService
} from "../services/phishingCampaignService";

import type { PhishingCampaign, CreateCampaignData } from "../types/phishingCampaign.types";

export function useCampaigns(projectId: string | null) {

    const [campaigns, setCampaigns] = useState<PhishingCampaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!projectId) {
            setCampaigns([]);
            return;
        }

        const fetchCampaigns = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getCampaigns(projectId);

                setCampaigns(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener las campañas"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchCampaigns();

    }, [projectId]);

    const createCampaign = async (campaignData: CreateCampaignData) => {

        if (!projectId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        const newCampaign = await createCampaignService(projectId, campaignData);

        setCampaigns((current) => [newCampaign, ...current]);

        return newCampaign;
    };

    const deleteCampaign = async (campaignId: string) => {

        if (!projectId) {
            throw new Error("No existe un proyecto seleccionado");
        }

        const { gophishWarning } = await deleteCampaignService(projectId, campaignId);

        setCampaigns((current) => current.filter((campaign) => campaign._id !== campaignId));

        return gophishWarning;
    };

    return {
        campaigns,
        loading,
        error,
        createCampaign,
        deleteCampaign
    };

}
