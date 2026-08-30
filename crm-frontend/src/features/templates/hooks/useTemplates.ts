import { useEffect, useState } from "react";

import { getTemplates, createTemplate as createTemplateService } from "../services/templateServices";

import type { ServiceTemplate, CreateServiceTemplateData } from "../types/templates.types";

export function useTemplates(businessId: string | null) {
    const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!businessId) {
            setTemplates([]);
            return;
        }

        const fetchTemplates = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getTemplates( businessId );

                setTemplates(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener los templates" );

            } finally {

                setLoading(false);

            }
        };

        fetchTemplates();

    }, [businessId]);

    const createTemplate = async ( templateData: CreateServiceTemplateData ) => {

        if (!businessId) {
            throw new Error( "No existe un Template seleccionado" );
        }

        const newTemplate = await createTemplateService( businessId, templateData );

        setTemplates((currentTemplates) => [
            ...currentTemplates,
            newTemplate
        ]);

        return newTemplate;
    };

    return {
        templates,
        loading,
        error,
        createTemplate,

    }

}