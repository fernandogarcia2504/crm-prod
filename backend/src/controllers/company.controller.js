import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import s3Client from "../config/s3.js";

import Company from "../models/company.model.js";
import Business from "../models/business.model.js"
import Contact from "../models/contact.model.js";
import Opportunity from "../models/opportunity.model.js";
import Project from "../models/project.model.js";
import Activity from "../models/activity.model.js";
import Document from "../models/document.model.js";
import Employee from "../models/employee.model.js";
import PhishingCampaign from "../models/phishingCampaign.model.js";

export const createCompany = async(req, res) => {
    try {

        const {businessId} = req.params;

        const {name, website, companySize, leadSource, status, type, notes, address} = req.body;

        if(!name || !website || !companySize || !leadSource) {
            return res.status(400).json({
                message: "Los parametros son requeridos"
            })
        }

        const business = await Business.findById(businessId);

        if (!business) {
            return res.status(404).json({
                message: "El Business no existe"
            });
        }

        const existingCompany = await Company.findOne({ business: businessId,name });

        if (existingCompany) {
            return res.status(409).json({
                message: "La empresa ya existe"
            })
        }

        const company = await Company.create({
            business: businessId,
            name,
            website,
            companySize,
            leadSource,
            status,
            type,
            notes,
            address
        });

        return res.status(201).json({
            message: "Empresa creada correctamente",
            company: {
                _id: company._id,
                name: company.name,
                website: company.website,
                companySize: company.companySize,
                leadSource: company.leadSource,
                status: company.status,
                type: company.type,
                notes: company.notes,
                address: company.address
            }
        })

    } catch(error) {
        console.error(error)
        return res.status(500).json({message: "Error al crear la empresa"})
    }
}

export const getCompanies = async (req, res) => {
    try {

        const { businessId } = req.params;

        const business = await Business.findById(businessId);

        if (!business) {
            return res.status(404).json({
                message: "El Business no existe"
            });
        }

        const companies = await Company.find({
            business: businessId
        });

        return res.status(200).json({
            companies
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener las empresas"
        });
    }
};


export const getCompany = async (req, res) => {
    try {

        const { businessId, companyId } = req.params;

        const company = await Company.findOne({
            _id: companyId,
            business: businessId
        });

        if (!company) {
            return res.status(404).json({
                message: "Empresa no encontrada"
            });
        }

        return res.status(200).json({
            company
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener la empresa"
        });
    }
};


export const updateCompany = async (req, res) => {
    try {

        const { businessId, companyId } = req.params;

        const {
            name,
            website,
            companySize,
            leadSource,
            status,
            type,
            notes,
            address
        } = req.body;

        const company = await Company.findOne({
            _id: companyId,
            business: businessId
        });

        if (!company) {
            return res.status(404).json({
                message: "Empresa no encontrada"
            });
        }

        if (name) {

            const existingCompany = await Company.findOne({
                name,
                business: businessId,
                _id: { $ne: companyId }
            });

            if (existingCompany) {
                return res.status(409).json({
                    message: "Ya existe una empresa con ese nombre"
                });
            }

            company.name = name;
        }

        if (website !== undefined) {
            company.website = website;
        }

        if (companySize !== undefined) {
            company.companySize = companySize;
        }

        if (leadSource !== undefined) {
            company.leadSource = leadSource;
        }

        if (status !== undefined) {
            company.status = status;
        }

        if (type !== undefined) {
            company.type = type;
        }

        if (notes !== undefined) {
            company.notes = notes;
        }

        if (address !== undefined) {
            company.address = address;
        }

        await company.save();

        return res.status(200).json({
            message: "Empresa actualizada correctamente",
            company: {
                _id: company._id,
                business: company.business,
                name: company.name,
                website: company.website,
                companySize: company.companySize,
                leadSource: company.leadSource,
                status: company.status,
                type: company.type,
                notes: company.notes,
                address: company.address
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar la empresa"
        });
    }
};


export const deleteCompany = async (req, res) => {
    try {

        const { businessId, companyId } = req.params;

        const company = await Company.findOne({
            _id: companyId,
            business: businessId
        });

        if (!company) {
            return res.status(404).json({
                message: "Empresa no encontrada"
            });
        }

        // Se borran primero los archivos en S3 de los documentos de la
        // empresa para no dejar archivos huerfanos en el bucket.
        const documents = await Document.find({ company: companyId });

        await Promise.all(
            documents.map((document) =>
                s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: document.s3Bucket,
                        Key: document.s3Key
                    })
                ).catch((error) => {
                    console.error(`Error al eliminar de S3 el archivo ${document.s3Key}:`, error);
                })
            )
        );

        // Se elimina cualquier relacion existente con esta empresa antes
        // de eliminarla (proyectos, contactos, actividades, oportunidades,
        // empleados, documentos y campañas de phishing).
        await Promise.all([
            Document.deleteMany({ company: companyId }),
            PhishingCampaign.deleteMany({ company: companyId }),
            Employee.deleteMany({ company: companyId }),
            Activity.deleteMany({ company: companyId }),
            Opportunity.deleteMany({ company: companyId }),
            Project.deleteMany({ company: companyId }),
            Contact.deleteMany({ company: companyId })
        ]);

        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Empresa eliminada correctamente"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al eliminar la empresa"
        });
    }
};