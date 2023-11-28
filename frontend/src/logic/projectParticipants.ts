import { UpdateProjectParticipant } from "./interfaces";
import { backendRequest } from "./request";

export const getProjectParticipants = async (projectId: number, page = 1) => {
  const response = await backendRequest(
    `projects/users/list/${projectId}/?page=${page}`,
    "GET",
    true,
  );
  const isOwner = await isProjectOwner(projectId);
  const data = await response.json();
  data["is_owner"] = isOwner["is_owner"];
  return data;
};

export const addProjectParticipant = async (
  email: string,
  projectId: number,
  isOwner: boolean,
) => {
  const response = await backendRequest(`projects/users/add/`, "POST", true, {
    project: projectId,
    email: email,
    is_owner: isOwner,
  });
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateProjectParticipant = async (
  data: UpdateProjectParticipant,
) => {
  const response = await backendRequest(
    `projects/users/update/${data.id}/`,
    "PUT",
    true,
    data,
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const deleteProjectParticipant = async (id: number) => {
  const response = await backendRequest(
    `projects/users/update/${id}/`,
    "DELETE",
    true,
  );
  return response.status;
};

export const isProjectOwner = async (projectId: number) => {
  const response = await backendRequest(
    `projects/owner/${projectId}/`,
    "GET",
    true,
  );
  return await response.json();
};

export const leaveProject = async (projectId: number) => {
  const response = await backendRequest(
    `projects/leave/${projectId}/`,
    "DELETE",
    true,
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const getMostActiveParticipants = async (projectId: number) => {
  const response = await backendRequest(
    `project/users/recent/${projectId}/`,
    "GET",
    true,
  );
  return await response.json();
};
