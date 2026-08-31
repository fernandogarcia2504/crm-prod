import type { ServiceTemplate, CreateServiceTemplateData, CreateServiceTemplateResponse, GetServiceTemplateResponse, GetServiceTemplatesResponse } from "../types/templates.types";

const API_URL = "https://crmprod-70ae5fa5478a.herokuapp.com/api";

export const getTemplates = async (businessId: string): Promise<ServiceTemplate[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/service-templates/${businessId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error(
            "Error al obtener los templates"
        );
    }

    const data: GetServiceTemplatesResponse = await response.json();

    return data.serviceTemplates
}

export const getTemplate = async (businessId: string, templateId: string): Promise<ServiceTemplate> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/service-templates/${businessId}/templates/${templateId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(
            "Error al obtener el template"
        );
    }

    const data: GetServiceTemplateResponse = await response.json();

    return data.serviceTemplate;

}

export const createTemplate = async (businessId: string, templatedata: CreateServiceTemplateData): Promise<ServiceTemplate> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/service-templates/${businessId}`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(templatedata)
    })

    const data: CreateServiceTemplateResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al crear el template"
        );
    }

    return data.serviceTemplate;
}
