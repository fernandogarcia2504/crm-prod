import axios from "axios";
import https from "https";

// Cliente HTTP hacia la API REST de Gophish. Se crea uno nuevo por
// llamada (barato) en lugar de cachear instancias, porque la URL base
// puede cambiar por negocio (ej. hoy es la IP local, mañana el túnel de
// Cloudflare) y así siempre se usa la URL mas reciente guardada en Business.
//
// La API key NUNCA se guarda en Mongo (para no exponerla via
// GET /api/business/:id, que el frontend consume tal cual). Vive solo
// en la variable de entorno GOPHISH_API_KEY del backend.
const buildClient = (baseUrl) => {

    if (!baseUrl) {
        throw new Error("Este negocio no tiene configurada la URL de su servidor Gophish");
    }

    const apiKey = process.env.GOPHISH_API_KEY;

    if (!apiKey) {
        throw new Error("Falta configurar GOPHISH_API_KEY en el backend (.env)");
    }

    return axios.create({
        baseURL: `${baseUrl.replace(/\/+$/, "")}/api`,
        timeout: 15000,
        headers: {
            "Authorization": `Bearer ${apiKey}`
        },
        // Gophish suele correr con un certificado autofirmado (IP local o
        // detrás de un túnel todavía sin TLS propio). Se acepta solo para
        // este cliente puntual, nunca de forma global en el proceso.
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

};

// Traduce errores de axios (incluyendo cuando Gophish rechaza el api_key
// via header) a mensajes legibles, sin tronar el proceso
const unwrapError = (error) => {

    if (error.response) {
        const detail = error.response.data?.message || error.response.statusText;
        return new Error(`Gophish respondió ${error.response.status}: ${detail}`);
    }

    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
        return new Error("No se pudo conectar con el servidor Gophish. Verifica la URL y que el backend tenga red hacia él.");
    }

    return error;
};


export const listTemplates = async (baseUrl) => {
    try {
        const client = buildClient(baseUrl);
        const { data } = await client.get("/templates/");
        return data;
    } catch (error) {
        throw unwrapError(error);
    }
};

export const listPages = async (baseUrl) => {
    try {
        const client = buildClient(baseUrl);
        const { data } = await client.get("/pages/");
        return data;
    } catch (error) {
        throw unwrapError(error);
    }
};

export const listSendingProfiles = async (baseUrl) => {
    try {
        const client = buildClient(baseUrl);
        const { data } = await client.get("/smtp/");
        return data;
    } catch (error) {
        throw unwrapError(error);
    }
};

// Crea (o reemplaza si ya existe con ese nombre) el grupo de objetivos en
// Gophish a partir de los empleados que ya están en el CRM, evitando el
// paso manual de exportar CSV + importar
export const upsertGroup = async (baseUrl, groupName, employees) => {

    try {

        const client = buildClient(baseUrl);

        const targets = employees.map((employee) => {

            const [firstName, ...rest] = employee.fullName.trim().split(" ");

            return {
                first_name: firstName || employee.fullName,
                last_name: rest.join(" "),
                email: employee.email,
                position: employee.position || ""
            };

        });

        const { data: existingGroups } = await client.get("/groups/");
        const existingGroup = existingGroups.find((group) => group.name === groupName);

        if (existingGroup) {
            const { data } = await client.put(`/groups/${existingGroup.id}`, {
                id: existingGroup.id,
                name: groupName,
                targets
            });
            return data;
        }

        const { data } = await client.post("/groups/", {
            name: groupName,
            targets
        });

        return data;

    } catch (error) {
        throw unwrapError(error);
    }

};

// Crea y lanza la campaña en Gophish, referenciando por nombre la
// plantilla/landing page/sending profile ya elegidos en el CRM
export const launchCampaign = async (baseUrl, {
    name,
    templateName,
    pageName,
    sendingProfileName,
    groupName,
    url,
    launchDate
}) => {

    try {

        const client = buildClient(baseUrl);

        const payload = {
            name,
            template: { name: templateName },
            page: { name: pageName },
            smtp: { name: sendingProfileName },
            groups: [{ name: groupName }],
            url: url || ""
        };

        if (launchDate) {
            payload.launch_date = new Date(launchDate).toISOString();
        }

        const { data } = await client.post("/campaigns/", payload);

        return data;

    } catch (error) {
        throw unwrapError(error);
    }

};

// Trae el detalle completo de la campaña en Gophish, incluyendo el
// arreglo "results" (uno por objetivo) y "timeline" de eventos, que es
// lo que se usa para sincronizar el embudo hacia el CRM
export const getCampaignResults = async (baseUrl, gophishCampaignId) => {

    try {
        const client = buildClient(baseUrl);
        const { data } = await client.get(`/campaigns/${gophishCampaignId}`);
        return data;
    } catch (error) {
        throw unwrapError(error);
    }

};

// Elimina la campaña directamente en Gophish. Si Gophish ya no la tiene
// (404, borrada a mano desde el panel) se trata como éxito: el objetivo
// ya se cumplió, no queda nada huérfano allá.
export const deleteCampaign = async (baseUrl, gophishCampaignId) => {

    try {
        const client = buildClient(baseUrl);
        await client.delete(`/campaigns/${gophishCampaignId}`);
    } catch (error) {

        if (error.response?.status === 404) {
            return;
        }

        throw unwrapError(error);
    }

};
