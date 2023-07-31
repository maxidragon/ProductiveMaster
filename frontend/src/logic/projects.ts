import { Project } from "./interfaces";
import { backendRequest } from "./request"

export const getAllProjects = async (): Promise<Project[]> => {
    const response = await backendRequest('projects/all/', 'GET', true);
    return await response.json();
};
export const getProjectsByStatus = async (status: string): Promise<Project[]> => {
    const response = await backendRequest(`projects/${status}/`, 'GET', true);
    return await response.json();
};

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await backendRequest(`projects/${id}/`, 'GET', true);
    return await response.json();
};

export const createProject = async (title: string, description: string, github?: string): Promise<number> => {
    const response = await backendRequest('projects/', 'POST', true, {title, description, github});
    return response.status;
};