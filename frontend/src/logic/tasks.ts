import { Task } from "./interfaces";
import { backendRequest } from "./request";

export const getTasksByStatus = async (status: string, page = 1) => {
  const response = await backendRequest(
    `tasks/list/${status}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const getTasksForProject = async (
  projectId: string,
  page = 1,
  status?: string,
) => {
  const url = status
    ? `tasks/project/${projectId}/status/${status}/?page=${page}`
    : `tasks/project/${projectId}/?page=${page}`;
  const response = await backendRequest(url, "GET", true);
  return await response.json();
};

export const getTaskById = async (taskId: string) => {
  const response = await backendRequest(`tasks/${taskId}/`, "GET", true);
  return await response.json();
};

export const searchTasks = async (query: string, status: string, page = 1) => {
  const response = await backendRequest(
    `tasks/search/status/${query}/${status}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const searchTasksForProject = async (
  query: string,
  projectId: number,
  page = 1,
  status?: string,
) => {
  let url = `tasks/search/project/${projectId}/${query}/`;
  if (status) {
    url += `status/${status}/`;
  }
  url += `?page=${page}`;
  const response = await backendRequest(url, "GET", true);
  return await response.json();
};

export const getHighPriorityTasks = async (page = 1) => {
  const response = await backendRequest(
    `tasks/high-priority/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const createTask = async (
  projectId: string,
  title: string,
  description: string,
  high_priority: boolean,
  issue?: string,
  assignee?: number,
) => {
  const body = {
    project: +projectId,
    title,
    description,
    issue,
    high_priority,
    assignee: assignee ? assignee : null,
  };
  const response = await backendRequest(`tasks/create/`, "POST", true, body);
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateTask = async (task: Task) => {
  const data = {
    ...task,
    project: task.project.id,
  };
  const response = await backendRequest(`tasks/${task.id}/`, "PUT", true, data);
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const deleteTask = async (taskId: string) => {
  const response = await backendRequest(`tasks/${taskId}/`, "DELETE", true);
  return response.status;
};
