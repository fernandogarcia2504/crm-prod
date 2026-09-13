import Activity from "../models/activity.model.js";
import Opportunity from "../models/opportunity.model.js";
import ServiceTemplate from "../models/servicetemplate.model.js"
import Project from "../models/project.model.js"

export const createActivity = async (req, res) => {

    try {

        const { opportunityId } = req.params;

        const {
            type,
            title,
            description,
            date,
            result,
            nextStep,
            scheduledDate,
            opportunityUpdates,
            finalAmount,
            billedAt
        } = req.body;

        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {

            return res.status(404).json({
                message: "La oportunidad no existe"
            });

        }

        if (!type || !title) {

            return res.status(400).json({
                message: "El tipo y titulo de la actividad son requeridos"
            });

        }

        const activity = await Activity.create({
            business: opportunity.business,
            opportunity: opportunity._id,
            company: opportunity.company,
            contact: opportunity.contact,
            type,
            title,
            description,
            date,
            result,
            nextStep,
            scheduledDate
        });

        if (opportunityUpdates) {

            const {
                stage,
                probability,
                estimatedAmount,
                estimatedCloseDate,
                expectedStartDate,
                priority,
                lostReason,
                nextAction,
                nextActionDate,
                notes
            } = opportunityUpdates;


            if (stage !== undefined) {
                opportunity.stage = stage;
            }

            if (probability !== undefined) {
                opportunity.probability = probability;
            }

            if (estimatedAmount !== undefined) {
                opportunity.estimatedAmount = estimatedAmount;
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

            if (nextActionDate !== undefined) {
                opportunity.nextActionDate = nextActionDate;
            }

            if (notes !== undefined) {
                opportunity.notes = notes;
            }

        }

        opportunity.lastActivityAt = date || new Date();

        let project = null;

        if(opportunity.stage === "Ganado" && !opportunity.project) {

            // El precio final es obligatorio en el momento en que se crea
            // el proyecto: es lo que alimenta las metricas de la pagina de
            // Finanzas, asi que no se puede ganar una oportunidad sin el.
            if (finalAmount === undefined || finalAmount === null || finalAmount === "") {
                return res.status(400).json({
                    message: "El precio final es requerido para marcar la oportunidad como Ganado y crear el proyecto"
                });
            }

            const serviceTemplate = await ServiceTemplate.findById( opportunity.serviceTemplate );

            if(!serviceTemplate) {
                return res.status(404).json({message: "El servicetemplate asociado a la oportunidad no existe"})
            }

            project = await Project.create({

                // Datos provenientes de Opportunity
                business: opportunity.business,

                company: opportunity.company,

                opportunity: opportunity._id,

                serviceTemplate: opportunity.serviceTemplate,

                name: opportunity.title,

                startDate: opportunity.expectedStartDate,

                // Precio final y fecha de facturacion: alimentan las
                // metricas de la pagina de Finanzas. Si no mandan fecha de
                // facturacion se usa la fecha de la actividad (o ahora).
                finalAmount: Number(finalAmount),

                billedAt: billedAt ? new Date(billedAt) : (date ? new Date(date) : new Date()),

                // Project comienza en Planeacion
                status: "Planeacion",

                // Datos propios del Project
                scope: {
                    domains: [],
                    subdomains: [],
                    ips: [],
                    applications: [],
                    apis: [],
                    exclusions: [],
                    allowedHours: "",
                    technicalContact: ""
                },

                assets: [],

                // Copiar fases del ServiceTemplate
                phases: serviceTemplate.phases.map(phase => ({

                    name: phase.name,

                    order: phase.order,

                    status: "Pendiente",

                    startedAt: null,

                    finishedAt: null,

                    checklist: phase.checklist.map(task => ({

                        task,

                        completed: false,

                        completedAt: null

                    }))

                })),

                // Copiar deliverables del ServiceTemplate
                deliverables: serviceTemplate.deliverables.map(
                    deliverable => ({

                        name: deliverable.name,

                        completed: false,

                        version: 1,

                        deliveredAt: null

                    })
                ),

                // Timeline comienza vacío
                timeline: []
            });

            opportunity.project = project._id
        }


        await opportunity.save();


        return res.status(201).json({

            message: "Actividad creada exitosamente",

            activity,

            opportunity,

            project

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al crear la actividad"
        });

    }

};

export const getOpportunityActivities = async (req, res) => {

    try {

        const { opportunityId } = req.params;


        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {

            return res.status(404).json({
                message: "La oportunidad no existe"
            });

        }


        const activities = await Activity
            .find({
                opportunity: opportunityId
            })
            .populate("contact", "fullName position")
            .sort({ date: -1 });


        return res.status(200).json({

            activities

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener las actividades"
        });

    }

};

export const getActivity = async (req, res) => {

    try {

        const { activityId } = req.params;


        const activity = await Activity
            .findById(activityId)
            .populate("business", "name")
            .populate("opportunity", "title stage")
            .populate("company", "name")
            .populate("contact", "fullName position");


        if (!activity) {

            return res.status(404).json({
                message: "La actividad no existe"
            });

        }


        return res.status(200).json({

            activity

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener la actividad"
        });

    }

};