import { useEffect, useState } from "react";

import { getActivities, createActivity as createActivityService } from "../services/activityService";
import type { Activity, CreateActivityData } from "../types/activities.types";

export function useActivities(opportunityId: string | null) {

    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!opportunityId) {
            setActivities([]);
            return
        }

        const fetchActivities = async () => {
            try {
                setLoading(true);
                setError(null)

                const data = await getActivities(opportunityId);

                setActivities(data)

                console.log(data)
            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener las actividades de la oportunidad" );

            } finally {

                setLoading(false);

            }
        } 
        
        fetchActivities();
    }, [opportunityId])

    const createActivity = async (activityData: CreateActivityData) => {
        
        if(!opportunityId) {
            throw new Error("No existe una oportunidad seleccionada")
        }

        const response = await createActivityService( opportunityId, activityData);

        setActivities((currentActivities) => [
            ...currentActivities,
            response.activity
        ])

        return response
    };

    return {
        activities,
        loading,
        error,
        createActivity,
    }

}