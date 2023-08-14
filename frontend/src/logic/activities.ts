import { Activity } from "./interfaces";
import { formatDate } from "./other";
import { backendRequest } from "./request"

export const getActivitiesForDay = async (date: Date): Promise<Activity[]> => {
    const response = await backendRequest(`activities/${formatDate(date)}/`, 'GET', true);
    return await response.json();
};

export const createActivity = async (title: string, description: string, start_time: Date, end_time: Date): Promise<number> => {
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    const response = await backendRequest('activities/create/', 'POST', true, { title, description, start_time: startDate, end_time: endDate });
    return response.status;
};

export const updateActivity = async (activity: Activity): Promise<number> => {
    const startDate = new Date(activity.start_time);
    const endDate = new Date(activity.end_time);
    const response = await backendRequest(`activities/detail/${activity.id}/`, 'PUT', true, { ...activity, start_time: startDate, end_time: endDate });
    return response.status;
};

export const deleteActivity = async (id: number): Promise<number> => {
    const response = await backendRequest(`activities/detail/${id}/`, 'DELETE', true);
    return response.status;
};
