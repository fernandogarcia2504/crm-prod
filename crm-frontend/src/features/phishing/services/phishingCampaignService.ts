import type {
    PhishingCampaign,
    CreateCampaignData,
    UpdateCampaignData,
    TargetEvent,
    GetCampaignsResponse,
    GetCampaignResponse,
    CampaignResponse,
    DeleteCampaignResponse
} from "../types/phishingCampaign.types";

const API_URL = "http://localhost:3000/api/phishing-campaigns";

export const getCampaigns = async (projectId: string): Promise<PhishingCampaign[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetCampaignsResponse = await response.json();

    if (!response.ok) {
        throw new Error("Error al obtener las campañas");
    }

    return data.campaigns;
};

export const getCampaign = async (projectId: string, campaignId: string): Promise<PhishingCampaign> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}/campaigns/${campaignId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetCampaignResponse = await response.json();

    if (!response.ok) {
        throw new Error("Error al obtener la campaña");
    }

    return data.campaign;
};

export const createCampaign = async (
    projectId: string,
    campaignData: CreateCampaignData
): Promise<PhishingCampaign> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
    });

    const data: CampaignResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al crear la campaña");
    }

    return data.campaign;
};

export const updateCampaign = async (
    projectId: string,
    campaignId: string,
    campaignData: UpdateCampaignData
): Promise<PhishingCampaign> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}/campaigns/${campaignId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
    });

    const data: CampaignResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la campaña");
    }

    return data.campaign;
};

export const updateTargetEvent = async (
    projectId: string,
    campaignId: string,
    targetId: string,
    event: TargetEvent,
    value: boolean
): Promise<PhishingCampaign> => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${projectId}/campaigns/${campaignId}/targets/${targetId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ event, value })
        }
    );

    const data: CampaignResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el evento del objetivo");
    }

    return data.campaign;
};

export const deleteCampaign = async (
    projectId: string,
    campaignId: string
): Promise<DeleteCampaignResponse> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}/campaigns/${campaignId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: DeleteCampaignResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al eliminar la campaña");
    }

    return data;
};

export const launchCampaignInGophish = async (
    projectId: string,
    campaignId: string
): Promise<PhishingCampaign> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}/campaigns/${campaignId}/launch`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: CampaignResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al lanzar la campaña en Gophish");
    }

    return data.campaign;
};

export const syncCampaignResults = async (
    projectId: string,
    campaignId: string
): Promise<PhishingCampaign> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${projectId}/campaigns/${campaignId}/sync`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: CampaignResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al sincronizar los resultados desde Gophish");
    }

    return data.campaign;
};
