import Business from "../models/business.model.js"
import Company from "../models/company.model.js"
import Contact from "../models/contact.model.js"
import ServiceTemplate from "../models/servicetemplate.model.js"
import Opportunity from "../models/opportunity.model.js"
import Project from "../models/project.model.js"

export const createOpportunity = async(req, res) => {
    try {

        const {companyId} = req.params;

        const { title, stage, estimatedAmount, estimatedCloseDate, expectedStartDate, priority, lostReason, nextAction, probability, businessId , serviceTemplateId, notes} = req.body

        if(!title) {
            return res.status(400).json({message: "El titulo es requerido"})
        }

        const existingOpportunity = await Opportunity.findOne({ title })

        if(existingOpportunity) {
            return res.status(409).json({message: "La oportunidad ya existe"})
        }

        const business = await Business.findById(businessId);

        if(!business) {
            return res.status(409).json({message: "El negocio no existe"})
        }
        const company = await Company.findById(companyId);

        if(!company) {
            return res.status(409).json({message: "El company no existe"})
        }

        const serviceTemplate = await ServiceTemplate.findById(serviceTemplateId);

        if(!serviceTemplate) {
            return res.status(409).json({message: "El template no existe"})
        }

        const opportunity = await Opportunity.create({
            business: businessId,
            company: companyId,
            serviceTemplate: serviceTemplateId,
            title,
            stage,
            estimatedAmount,
            estimatedCloseDate,
            expectedStartDate,
            priority,
            lostReason,
            nextAction,
            notes,
            probability
        })

        await opportunity.save()

        return res.status(201).json({
            message: "Oportunidad creada exitosamente",
            opportunity
        })

    } catch(error) {

        console.error(error)

        return res.status(500).json({message: "Error al crear la oportunidad"})
    }
}

export const getOpportunities = async (req, res) => {

    try {

        const { companyId } = req.params;


        const company = await Company.findById(companyId);

        if (!company) {

            return res.status(404).json({
                message: "El cliente no existe"
            });

        }


        const opportunities = await Opportunity
            .find({ company: companyId })
            .populate("business", "name")
            .populate("serviceTemplate", "name")
            .populate("project", "name")
            .sort({ createdAt: -1 });


        return res.status(200).json({

            opportunities

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener las oportunidades"
        });

    }

};



// GET ONE OPPORTUNITY
export const getOpportunity = async (req, res) => {

    try {

        const { opportunityId } = req.params;


        const opportunity = await Opportunity
            .findById(opportunityId)
            .populate("business", "name")
            .populate("company", "name")
            .populate("contact", "fullName position")
            .populate("serviceTemplate", "name description")
            .populate("project", "name status");


        if (!opportunity) {

            return res.status(404).json({
                message: "La oportunidad no existe"
            });

        }


        return res.status(200).json({

            opportunity

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener la oportunidad"
        });

    }

};

export const updateOpportunity = async (req, res) => {

    try {

        const { opportunityId } = req.params;

        const {
            companyId,
            serviceTemplateId,
            title,
            stage,
            estimatedAmount,
            probability,
            estimatedCloseDate,
            expectedStartDate,
            priority,
            lostReason,
            nextAction,
            notes
        } = req.body;


        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {
            return res.status(404).json({
                message: "La oportunidad no existe"
            });
        }


        if (companyId) {

            const company = await Company.findById(companyId);

            if (!company) {
                return res.status(404).json({
                    message: "La empresa no existe"
                });
            }

            opportunity.company = companyId;
        }

        if (serviceTemplateId) {

            const serviceTemplate =
                await ServiceTemplate.findById(serviceTemplateId);

            if (!serviceTemplate) {
                return res.status(404).json({
                    message: "El ServiceTemplate no existe"
                });
            }

            opportunity.serviceTemplate = serviceTemplateId;
        }


        if (title !== undefined) {
            opportunity.title = title;
        }

        if (stage !== undefined) {
            opportunity.stage = stage;
        }

        if (estimatedAmount !== undefined) {
            opportunity.estimatedAmount = estimatedAmount;
        }

        if (probability !== undefined) {
            opportunity.probability = probability;
        }

        if (estimatedCloseDate !== undefined) {
            opportunity.estimatedCloseDate = estimatedCloseDate;
        }

        if (expectedStartDate !== undefined) {
            opportunity.expectedStartDate = expectedStartDate;
        }

        if (priority !== undefined) {
            opportunity.priority = priority;
        }

        if (lostReason !== undefined) {
            opportunity.lostReason = lostReason;
        }

        if (nextAction !== undefined) {
            opportunity.nextAction = nextAction;
        }

        if (notes !== undefined) {
            opportunity.notes = notes;
        }


        await opportunity.save();


        return res.status(200).json({

            message: "Oportunidad actualizada exitosamente",

            opportunity

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar la oportunidad"
        });

    }

};