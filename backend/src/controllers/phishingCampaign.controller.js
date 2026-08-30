import PhishingCampaign from "../models/phishingCampaign.model.js";
import Employee from "../models/employee.model.js";
import Project from "../models/project.model.js";
import Business from "../models/business.model.js";

import {
    upsertGroup,
    launchCampaign as launchGophishCampaign,
    getCampaignResults,
    deleteCampaign as deleteGophishCampaign
} from "../services/gophish.service.js";

const TARGET_EVENTS = ["sent", "opened", "clicked", "submittedData", "reported"];
const EVENT_TIMESTAMP_FIELD = {
    sent: "sentAt",
    opened: "openedAt",
    clicked: "clickedAt",
    submittedData: "submittedAt",
    reported: "reportedAt"
};

// Calcula el embudo de la campaña: enviados -> abiertos -> clic ->
// enviaron datos -> reportaron, mas tasas de clic y de reporte
const calculateMetrics = (targets) => {

    const totalTargets = targets.length;

    const sent = targets.filter((target) => target.sent).length;
    const opened = targets.filter((target) => target.opened).length;
    const clicked = targets.filter((target) => target.clicked).length;
    const submittedData = targets.filter((target) => target.submittedData).length;
    const reported = targets.filter((target) => target.reported).length;

    return {
        totalTargets,
        sent,
        opened,
        clicked,
        submittedData,
        reported,
        clickRate: sent ? Math.round((clicked / sent) * 100) : 0,
        reportRate: sent ? Math.round((reported / sent) * 100) : 0
    };
};

const serializeCampaign = (campaign) => ({
    ...campaign.toObject(),
    metrics: calculateMetrics(campaign.targets)
});


// CREAR UNA CAMPAÑA DE PHISHING (a partir de empleados ya cargados)
export const createCampaign = async (req, res) => {

    try {

        const { projectId } = req.params;

        const {
            name,
            emailTemplate,
            landingPage,
            sendingProfile,
            senderDomain,
            campaignUrl,
            launchDate,
            gophishCampaignId,
            notes,
            employeeIds
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "El nombre de la campaña es requerido"
            });
        }

        if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
            return res.status(400).json({
                message: "Se requiere al menos un empleado como objetivo"
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "El proyecto no existe"
            });
        }

        const employees = await Employee.find({
            _id: { $in: employeeIds },
            company: project.company
        });

        if (employees.length === 0) {
            return res.status(404).json({
                message: "Ninguno de los empleados indicados pertenece a la empresa de este proyecto"
            });
        }

        const campaign = await PhishingCampaign.create({
            business: project.business,
            company: project.company,
            project: projectId,
            name,
            emailTemplate,
            landingPage,
            sendingProfile,
            senderDomain,
            campaignUrl,
            launchDate,
            gophishCampaignId,
            notes,
            targets: employees.map((employee) => ({ employee: employee._id }))
        });

        return res.status(201).json({
            message: "Campaña creada exitosamente",
            campaign: serializeCampaign(campaign)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al crear la campaña"
        });

    }

};


// LISTAR CAMPAÑAS DE UN PROYECTO
export const getCampaigns = async (req, res) => {

    try {

        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "El proyecto no existe"
            });
        }

        const campaigns = await PhishingCampaign
            .find({ project: projectId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            campaigns: campaigns.map(serializeCampaign)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener las campañas"
        });

    }

};


// OBTENER UNA CAMPAÑA (con el detalle de cada empleado objetivo)
export const getCampaign = async (req, res) => {

    try {

        const { projectId, campaignId } = req.params;

        const campaign = await PhishingCampaign
            .findOne({ _id: campaignId, project: projectId })
            .populate("targets.employee", "fullName email position sector");

        if (!campaign) {
            return res.status(404).json({
                message: "La campaña no existe"
            });
        }

        return res.status(200).json({
            campaign: serializeCampaign(campaign)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener la campaña"
        });

    }

};


// ACTUALIZAR DATOS GENERALES DE LA CAMPAÑA (estado, fechas, referencias a gophish)
export const updateCampaign = async (req, res) => {

    try {

        const { projectId, campaignId } = req.params;

        const {
            name,
            emailTemplate,
            landingPage,
            sendingProfile,
            senderDomain,
            campaignUrl,
            launchDate,
            status,
            gophishCampaignId,
            notes
        } = req.body;

        const campaign = await PhishingCampaign.findOne({
            _id: campaignId,
            project: projectId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "La campaña no existe"
            });
        }

        if (name !== undefined) campaign.name = name;
        if (emailTemplate !== undefined) campaign.emailTemplate = emailTemplate;
        if (landingPage !== undefined) campaign.landingPage = landingPage;
        if (sendingProfile !== undefined) campaign.sendingProfile = sendingProfile;
        if (senderDomain !== undefined) campaign.senderDomain = senderDomain;
        if (campaignUrl !== undefined) campaign.campaignUrl = campaignUrl;
        if (launchDate !== undefined) campaign.launchDate = launchDate;
        if (status !== undefined) campaign.status = status;
        if (gophishCampaignId !== undefined) campaign.gophishCampaignId = gophishCampaignId;
        if (notes !== undefined) campaign.notes = notes;

        await campaign.save();

        return res.status(200).json({
            message: "Campaña actualizada correctamente",
            campaign: serializeCampaign(campaign)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar la campaña"
        });

    }

};


// ACTUALIZAR EL EVENTO DE UN EMPLEADO OBJETIVO DENTRO DE LA CAMPAÑA
// (ej. marcar que hizo clic o que reporto el correo). Pensado para
// capturar manualmente lo que gophish ya registro, o para conectarse
// mas adelante a un webhook de gophish que llame este mismo endpoint.
export const updateTargetEvent = async (req, res) => {

    try {

        const { projectId, campaignId, targetId } = req.params;
        const { event, value, at } = req.body;

        if (!TARGET_EVENTS.includes(event)) {
            return res.status(400).json({
                message: `El evento debe ser uno de: ${TARGET_EVENTS.join(", ")}`
            });
        }

        const campaign = await PhishingCampaign.findOne({
            _id: campaignId,
            project: projectId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "La campaña no existe"
            });
        }

        const target = campaign.targets.id(targetId);

        if (!target) {
            return res.status(404).json({
                message: "El objetivo no existe en esta campaña"
            });
        }

        const eventValue = value !== undefined ? Boolean(value) : true;
        const timestampField = EVENT_TIMESTAMP_FIELD[event];

        target[event] = eventValue;
        target[timestampField] = eventValue ? (at ? new Date(at) : new Date()) : null;

        // Cascada logica minima: si aun no se registro un paso previo del
        // embudo pero se marca uno posterior, se asume que tambien ocurrio
        const funnelOrder = ["sent", "opened", "clicked", "submittedData"];
        const stepIndex = funnelOrder.indexOf(event);

        if (eventValue && stepIndex > 0) {
            for (let i = 0; i < stepIndex; i++) {
                const previousStep = funnelOrder[i];
                if (!target[previousStep]) {
                    target[previousStep] = true;
                    target[EVENT_TIMESTAMP_FIELD[previousStep]] = target[timestampField];
                }
            }
        }

        await campaign.save();

        return res.status(200).json({
            message: "Evento actualizado correctamente",
            campaign: serializeCampaign(campaign)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar el evento del objetivo"
        });

    }

};


// LANZAR LA CAMPAÑA EN GOPHISH (crea el grupo con los empleados del CRM
// y crea+lanza la campaña real via la API de Gophish)
export const launchCampaignInGophish = async (req, res) => {

    try {

        const { projectId, campaignId } = req.params;

        const campaign = await PhishingCampaign.findOne({
            _id: campaignId,
            project: projectId
        }).populate("targets.employee", "fullName email position sector");

        if (!campaign) {
            return res.status(404).json({
                message: "La campaña no existe"
            });
        }

        if (campaign.gophishCampaignId) {
            return res.status(409).json({
                message: `Esta campaña ya fue lanzada en Gophish (id: ${campaign.gophishCampaignId}). Usa sincronizar resultados en lugar de volver a lanzarla.`
            });
        }

        if (!campaign.emailTemplate || !campaign.landingPage || !campaign.sendingProfile) {
            return res.status(400).json({
                message: "Faltan por definir la plantilla de correo, la landing page o el sending profile de la campaña"
            });
        }

        if (!campaign.campaignUrl) {
            return res.status(400).json({
                message: "Falta la URL pública de la landing page. Gophish generaría los links del correo con este campo vacío."
            });
        }

        const business = await Business.findById(campaign.business);

        if (!business || !business.gophishUrl) {
            return res.status(400).json({
                message: "Este negocio no tiene configurada la URL de su servidor Gophish"
            });
        }

        const employees = campaign.targets
            .map((target) => target.employee)
            .filter(Boolean);

        if (employees.length === 0) {
            return res.status(400).json({
                message: "La campaña no tiene empleados objetivo con datos válidos"
            });
        }

        const groupName = `${campaign.name} (${campaign._id.toString().slice(-6)})`;

        await upsertGroup(business.gophishUrl, groupName, employees);

        const gophishCampaign = await launchGophishCampaign(business.gophishUrl, {
            name: groupName,
            templateName: campaign.emailTemplate,
            pageName: campaign.landingPage,
            sendingProfileName: campaign.sendingProfile,
            groupName,
            url: campaign.campaignUrl,
            launchDate: campaign.launchDate
        });

        campaign.gophishCampaignId = String(gophishCampaign.id);
        campaign.status = "En curso";

        campaign.targets.forEach((target) => {
            target.sent = true;
            target.sentAt = target.sentAt || new Date();
        });

        await campaign.save();

        return res.status(200).json({
            message: "Campaña lanzada en Gophish exitosamente",
            campaign: serializeCampaign(campaign)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: error.message || "Error al lanzar la campaña en Gophish"
        });

    }

};


// Busca en el timeline de Gophish el evento mas reciente para un correo
// dado cuyo mensaje coincide con el texto buscado, y devuelve su fecha
const findEventTime = (timeline, email, messageIncludes) => {

    if (!Array.isArray(timeline)) return null;

    const match = timeline.find((event) =>
        event.email === email &&
        typeof event.message === "string" &&
        event.message.toLowerCase().includes(messageIncludes.toLowerCase())
    );

    return match ? new Date(match.time) : null;

};

// SINCRONIZAR RESULTADOS DESDE GOPHISH (jala el estado real de la
// campaña y actualiza el embudo de cada empleado objetivo)
export const syncCampaignResults = async (req, res) => {

    try {

        const { projectId, campaignId } = req.params;

        const campaign = await PhishingCampaign.findOne({
            _id: campaignId,
            project: projectId
        }).populate("targets.employee", "fullName email position sector");

        if (!campaign) {
            return res.status(404).json({
                message: "La campaña no existe"
            });
        }

        if (!campaign.gophishCampaignId) {
            return res.status(400).json({
                message: "Esta campaña aún no ha sido lanzada en Gophish"
            });
        }

        const business = await Business.findById(campaign.business);

        if (!business || !business.gophishUrl) {
            return res.status(400).json({
                message: "Este negocio no tiene configurada la URL de su servidor Gophish"
            });
        }

        const gophishCampaign = await getCampaignResults(business.gophishUrl, campaign.gophishCampaignId);

        const results = Array.isArray(gophishCampaign.results) ? gophishCampaign.results : [];
        const timeline = gophishCampaign.timeline;

        // Orden de progreso de "status" tal como lo reporta Gophish
        const STATUS_RANK = {
            "Email Sent": 1,
            "Email Opened": 2,
            "Clicked Link": 3,
            "Submitted Data": 4
        };

        campaign.targets.forEach((target) => {

            const employeeEmail = target.employee?.email;

            if (!employeeEmail) return;

            const result = results.find((r) => r.email === employeeEmail);

            if (!result) return;

            const rank = STATUS_RANK[result.status] || 0;

            target.sent = rank >= 1;
            target.sentAt = findEventTime(timeline, employeeEmail, "Email Sent") || target.sentAt;

            target.opened = rank >= 2;
            target.openedAt = findEventTime(timeline, employeeEmail, "Email Opened") || target.openedAt;

            target.clicked = rank >= 3;
            target.clickedAt = findEventTime(timeline, employeeEmail, "Clicked Link") || target.clickedAt;

            target.submittedData = rank >= 4;
            target.submittedAt = findEventTime(timeline, employeeEmail, "Submitted Data") || target.submittedAt;

            // "reported" no siempre viene como status, en versiones
            // recientes de Gophish es un campo booleano aparte o un
            // evento en el timeline con la palabra "report"
            const reportedFromField = result.reported === true;
            const reportedFromTimeline = Boolean(findEventTime(timeline, employeeEmail, "report"));

            target.reported = reportedFromField || reportedFromTimeline;

            if (target.reported && !target.reportedAt) {
                target.reportedAt = findEventTime(timeline, employeeEmail, "report") || new Date();
            }

        });

        await campaign.save();

        return res.status(200).json({
            message: "Resultados sincronizados desde Gophish",
            campaign: serializeCampaign(campaign)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: error.message || "Error al sincronizar los resultados desde Gophish"
        });

    }

};


// ELIMINAR UNA CAMPAÑA (en Gophish y en el CRM con una sola acción)
export const deleteCampaign = async (req, res) => {

    try {

        const { projectId, campaignId } = req.params;

        const campaign = await PhishingCampaign.findOne({
            _id: campaignId,
            project: projectId
        });

        if (!campaign) {
            return res.status(404).json({
                message: "La campaña no existe"
            });
        }

        let gophishWarning = null;

        // Si la campaña nunca se lanzó en Gophish no hay nada que borrar
        // allá. Si sí se lanzó, se intenta borrar primero en Gophish; si
        // eso falla (servidor apagado, ya no existe, etc.) no se bloquea
        // el borrado del registro en el CRM, pero se avisa al usuario
        // para que revise el panel de Gophish manualmente.
        if (campaign.gophishCampaignId) {

            try {

                const business = await Business.findById(campaign.business);

                if (!business || !business.gophishUrl) {
                    gophishWarning = "Este negocio no tiene configurada la URL de Gophish; la campaña solo se eliminó del CRM.";
                } else {
                    await deleteGophishCampaign(business.gophishUrl, campaign.gophishCampaignId);
                }

            } catch (error) {

                console.error(error);

                gophishWarning = `La campaña se eliminó del CRM, pero no se pudo eliminar en Gophish: ${error.message}`;

            }

        }

        await PhishingCampaign.findByIdAndDelete(campaignId);

        return res.status(200).json({
            message: gophishWarning
                ? "Campaña eliminada del CRM"
                : "Campaña eliminada correctamente en Gophish y en el CRM",
            gophishWarning
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al eliminar la campaña"
        });

    }

};