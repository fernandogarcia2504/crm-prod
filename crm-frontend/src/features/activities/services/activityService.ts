import type { Activity, CreateActivityResponse, CreateActivityData, GetActivitiesResponse, GetActivityResponse } from "../types/activities.types";

const API_URL = "https://crmprod-70ae5fa5478a.herokuapp.com/api/activities";

export const getActivities = async(opportunityId: string): Promise<Activity[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${opportunityId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) {
        throw new Error (
            "Error al obtener las actividades de la oportunidad"
        )
    }

    const data: GetActivitiesResponse = await response.json()

    return data.activities
}

export const getActivity = async (opportunityId: string, activityId: string): Promise<Activity> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${opportunityId}/${activityId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(
            "Error al obtener la actividad"
        );
    }

    const data: GetActivityResponse = await response.json();

    return data.activity;

}

export const createActivity = async (opportunityId: string, activityData: CreateActivityData): Promise<CreateActivityResponse> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${opportunityId}`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(activityData)
    })

    const data: CreateActivityResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al crear la actividad"
        );
    }

    return data;
}
