import { useEffect, useState } from "react";

import {
    getCampaign,
    updateCampaign as updateCampaignService,
    updateTargetEvent as updateTargetEventService,
    launchCampaignInGophish as launchCampaignInGophishService,
    syncCampaignResults as syncCampaignResultsService,
    deleteCampaign as deleteCampaignService
} from "../services/phishingCampaignService";

import type { PhishingCampaign, UpdateCampaignData, TargetEvent } from "../types/phishingCampaign.types";

export function useCampaign(projectId: string | null, campaignId: string | null) {

    const [campaign, setCampaign] = useState<PhishingCampaign | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!projectId || !campaignId) {
            setCampaign(null);
            return;
        }

        const fetchCampaign = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getCampaign(projectId, campaignId);

                setCampaign(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener la campaña"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchCampaign();

    }, [projectId, campaignId]);

    const updateCampaign = async (campaignData: UpdateCampaignData) => {

        if (!projectId || !campaignId) {
            throw new Error("No existe una campaña seleccionada");
        }

        const updatedCampaign = await updateCampaignService(projectId, campaignId, campaignData);

        setCampaign(updatedCampaign);

        return updatedCampaign;
    };

    const updateTargetEvent = async (targetId: string, event: TargetEvent, value: boolean) => {

        if (!projectId || !campaignId) {
            throw new Error("No existe una campaña seleccionada");
        }

        const updatedCampaign = await updateTargetEventService(
            projectId,
            campaignId,
            targetId,
            event,
            value
        );

        setCampaign(updatedCampaign);

        return updatedCampaign;
    };

    const launchCampaign = async () => {

        if (!projectId || !campaignId) {
            throw new Error("No existe una campaña seleccionada");
        }

        const updatedCampaign = await launchCampaignInGophishService(projectId, campaignId);

        setCampaign(updatedCampaign);

        return updatedCampaign;
    };

    const syncResults = async () => {

        if (!projectId || !campaignId) {
            throw new Error("No existe una campaña seleccionada");
        }

        const updatedCampaign = await syncCampaignResultsService(projectId, campaignId);

        setCampaign(updatedCampaign);

        return updatedCampaign;
    };

    const deleteCampaign = async () => {

        if (!projectId || !campaignId) {
            throw new Error("No existe una campaña seleccionada");
        }

        const { gophishWarning } = await deleteCampaignService(projectId, campaignId);

        return gophishWarning;
    };

    return {
        campaign,
        loading,
        error,
        updateCampaign,
        updateTargetEvent,
        launchCampaign,
        syncResults,
        deleteCampaign
    };

}
