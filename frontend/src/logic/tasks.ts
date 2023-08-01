import { Task } from "./interfaces";
import { backendRequest } from "./request";

export const getTasksByStatus = async (status: string) => {
  const response = await backendRequest(`tasks/list/${status}/`, "GET", true);
  return await response.json();
};

export const getTasksForProject = async (
  projectId: string,
  status?: string
) => {
  const url = status
    ? `tasks/project/${projectId}/status/${status}`
    : `tasks/project/${projectId}/`;
  const response = await backendRequest(url, "GET", true);
  return await response.json();
};

export const getTaskById = async (taskId: string) => {
  const response = await backendRequest(`tasks/${taskId}/`, "GET", true);
  return await response.json();
};

export const createTask = async (
  projectId: string,
  title: string,
  description: string,
  issue?: string
) => {
  const body = { project: +projectId, title, description, issue };
  console.log(body);
  const response = await backendRequest(`tasks/create/`, "POST", true, body);
  return response.status;
};

export const updateTask = async (task: Task) => {
  const response = await backendRequest(`tasks/${task.id}/`, "PUT", true, task);
  return response.status;
};

export const deleteTask = async (taskId: string) => {
  const response = await backendRequest(`tasks/${taskId}/`, "DELETE", true);
  return response.status;
};
