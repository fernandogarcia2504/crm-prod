import Business from "../models/business.model.js";

import { listTemplates, listPages, listSendingProfiles } from "../services/gophish.service.js";

const resolveGophishUrl = async (businessId) => {

    const business = await Business.findById(businessId);

    if (!business) {
        const error = new Error("El negocio no existe");
        error.status = 404;
        throw error;
    }

    if (!business.gophishUrl) {
        const error = new Error("Este negocio no tiene configurada la URL de su servidor Gophish");
        error.status = 400;
        throw error;
    }

    return business.gophishUrl;

};

export const getTemplates = async (req, res) => {

    try {

        const { businessId } = req.params;

        const gophishUrl = await resolveGophishUrl(businessId);

        const templates = await listTemplates(gophishUrl);

        return res.status(200).json({ templates });

    } catch (error) {

        console.error(error);

        return res.status(error.status || 500).json({
            message: error.message || "Error al obtener las plantillas de Gophish"
        });

    }

};

export const getPages = async (req, res) => {

    try {

        const { businessId } = req.params;

        const gophishUrl = await resolveGophishUrl(businessId);

        const pages = await listPages(gophishUrl);

        return res.status(200).json({ pages });

    } catch (error) {

        console.error(error);

        return res.status(error.status || 500).json({
            message: error.message || "Error al obtener las landing pages de Gophish"
        });

    }

};

export const getSendingProfiles = async (req, res) => {

    try {

        const { businessId } = req.params;

        const gophishUrl = await resolveGophishUrl(businessId);

        const sendingProfiles = await listSendingProfiles(gophishUrl);

        return res.status(200).json({ sendingProfiles });

    } catch (error) {

        console.error(error);

        return res.status(error.status || 500).json({
            message: error.message || "Error al obtener los sending profiles de Gophish"
        });

    }

};
