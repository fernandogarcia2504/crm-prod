import { useEffect, useState } from "react";

import { getTemplate } from "../services/templateServices";

import type { ServiceTemplate } from "../types/templates.types";

export function useTemplate(businessId: string | null, templateId: string | null) {

    const [template, setTemplate] = useState<ServiceTemplate | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!businessId || !templateId) {
            setTemplate(null);
            return;
        }

        const fetchTemplate = async () => {
            try {

                setLoading(true);
                setError(null);

                const data = await getTemplate(businessId, templateId);

                setTemplate(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener el template"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchTemplate();

    }, [businessId, templateId]);

    return {
        template,
        loading,
        error
    };

}
