import { UpdateProjectParticipant } from "./interfaces";
import { backendRequest } from "./request";

export const getProjectParticipants = async (projectId: number, page = 1) => {
  const response = await backendRequest(
    `projects/users/list/${projectId}/?page=${page}`,
    "GET",
    true,
  );
  const isOwner = await backendRequest(
    `projects/owner/${projectId}/`,
    "GET",
    true,
  );
  const data = await response.json();
  const isOwnerData = await isOwner.json();
  data["is_owner"] = isOwnerData["is_owner"];
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
  return await response.json();
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
  return {
    status: response.status,
    data: await response.json(),
  };
};
