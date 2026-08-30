export interface GophishTemplate {
    id: number;
    name: string;
}

export interface GophishPage {
    id: number;
    name: string;
}

export interface GophishSendingProfile {
    id: number;
    name: string;
}

const API_URL = "http://localhost:3000/api/gophish";

const authHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export const getGophishTemplates = async (businessId: string): Promise<GophishTemplate[]> => {

    const response = await fetch(`${API_URL}/${businessId}/templates`, { headers: authHeaders() });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener las plantillas de Gophish");
    }

    return data.templates;
};

export const getGophishPages = async (businessId: string): Promise<GophishPage[]> => {

    const response = await fetch(`${API_URL}/${businessId}/pages`, { headers: authHeaders() });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener las landing pages de Gophish");
    }

    return data.pages;
};

export const getGophishSendingProfiles = async (businessId: string): Promise<GophishSendingProfile[]> => {

    const response = await fetch(`${API_URL}/${businessId}/sending-profiles`, { headers: authHeaders() });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al obtener los sending profiles de Gophish");
    }

    return data.sendingProfiles;
};
