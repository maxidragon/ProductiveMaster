import { LearningResource } from "./interfaces";
import { backendRequest } from "./request";

export const getLearningResources = async (learningId: number, page = 1) => {
  const response = await backendRequest(
    `learnings/resources/list/${learningId}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const createLearningResource = async (
  learningId: number,
  title: string,
  url: string,
) => {
  const response = await backendRequest(
    `learnings/resources/create/`,
    "POST",
    true,
    { title, url, learning: learningId },
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateLearningResource = async (item: LearningResource) => {
  const response = await backendRequest(
    `learnings/resources/${item.id}/`,
    "PUT",
    true,
    item,
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const deleteLearningResource = async (resourceId: number) => {
  const response = await backendRequest(
    `learnings/resources/${resourceId}/`,
    "DELETE",
    true,
  );
  return response.status;
};

export const getAllLearningResources = async (page = 1) => {
  const response = await backendRequest(
    `learnings/resources/all/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const searchLearningResources = async (query: string, page = 1) => {
  const response = await backendRequest(
    `learnings/resources/search/${query}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};
