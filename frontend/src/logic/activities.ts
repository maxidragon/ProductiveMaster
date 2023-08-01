import { Activity } from "./interfaces";
import { backendRequest } from "./request"

export const getActivitiesForDay = async (date: Date): Promise<Activity[]> => {
    const response = await backendRequest(`activities/${date.toISOString()}`, 'GET', true);
    return await response.json();
};

export const createActivity = async (title: string, description: string, start_time: Date, end_time: Date): Promise<number> => {
    const response = await backendRequest('activities/create', 'POST', true, { title, description, start_time, end_time });
    return response.status;
};

export const updateActivity = async (id: number, title: string, description: string, start_time: Date, end_time: Date): Promise<number> => {
    const response = await backendRequest(`activities/${id}`, 'PUT', true, { title, description, start_time, end_time });
    return response.status;
};

export const deleteActivity = async (id: number): Promise<number> => {
    const response = await backendRequest(`activities/${id}`, 'DELETE', true);
    return response.status;
};
