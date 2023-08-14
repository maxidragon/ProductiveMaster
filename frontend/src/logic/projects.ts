import { Project } from "./interfaces";
import { backendRequest } from "./request"

export const getAllProjects = async (page: number = 1) => {
    const response = await backendRequest(`projects/?page=${page}`, 'GET', true);
    return await response.json();
};
export const getProjectsByStatus = async (status: string, page: number = 1) => {
    const response = await backendRequest(`projects/status/${status}/?page=${page}`, 'GET', true);
    return await response.json();
};

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await backendRequest(`projects/detail/${id}/`, 'GET', true);
    return await response.json();
};

export const createProject = async (title: string, description: string, github?: string): Promise<number> => {
    const response = await backendRequest('projects/', 'POST', true, {title, description, github});
    return response.status;
};

export const updateProject = async (project: Project): Promise<number> => {
    const response = await backendRequest(`projects/detail/${project.id}/`, 'PUT', true, project);
    return response.status;
};

export const deleteProject = async (id: string): Promise<number> => {
    const response = await backendRequest(`projects/detail/${id}/`, 'DELETE', true);
    return response.status;
};

export const searchProjects = async (query: string, page: number = 1, status?: string) => {
    let url = `projects/search/${query}/`;
    if (status) {
      url += `status/${status}/`;
    }
    url += `?page=${page}`;
    const response = await backendRequest(url, 'GET', true);
    return await response.json();
};