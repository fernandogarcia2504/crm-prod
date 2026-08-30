import ServiceTemplate from "../models/servicetemplate.model.js"
import Business from "../models/business.model.js"

export const createServiceTemplate = async (req,res) => {
    try {

        const { businessId } = req.params;

        const { name, description, active, phases, deliverables, expectedEvidence, projectStructure, estimatedDuration, kpis} = req.body;

        const business = await Business.findById(businessId);

        if(!business) {
            return res.status(404).json({ message: "Business no encontrado"})
        }

        const existingServiceTemplate = await ServiceTemplate.findOne({ name })

        if(existingServiceTemplate) {
            return res.status(409).json({ message: "El template ya existe"})
        }

        const serviceTemplate = new ServiceTemplate({
            business: businessId,
            name,
            description,
            active,
            phases,
            deliverables,
            expectedEvidence,
            projectStructure,
            estimatedDuration,
            kpis
        })

        await serviceTemplate.save();

        res.status(201).json({
            message: "Template creado con exito",
            serviceTemplate
        });

    } catch (error) {
       
        console.error(error)

        return res.status(500).json({message: "Error al crear el template"})
    }
}

export const getServiceTemplates = async (req, res) => {
    try {

        const { businessId } = req.params;

        const business = await Business.findById(businessId);

        if (!business) {
            return res.status(404).json({
                message: "Business no encontrado"
            });
        }

        const serviceTemplates = await ServiceTemplate.find({
            business: businessId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            serviceTemplates
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener los templates"
        });
    }
};

export const getServiceTemplate = async (req, res) => {
    try {

        const { businessId, serviceTemplateId } = req.params;

        const serviceTemplate = await ServiceTemplate.findOne({
            _id: serviceTemplateId,
            business: businessId
        });

        if (!serviceTemplate) {
            return res.status(404).json({
                message: "Template no encontrado"
            });
        }

        return res.status(200).json({
            serviceTemplate
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener el template"
        });
    }
};