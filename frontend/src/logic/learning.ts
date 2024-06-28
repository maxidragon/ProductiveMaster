import { LearningType } from "./interfaces";
import { backendRequest } from "./request";

export const getLearningsByStatus = async (status: string, page = 1) => {
  const response = await backendRequest(
    `learnings/status/${status}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const getRecentLearnings = async () => {
  const response = await backendRequest(`learnings/recent/`, "GET", true);
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const searchLearnings = async (
  query: string,
  status: string,
  page = 1,
) => {
  const response = await backendRequest(
    `learnings/search/${query}/status/${status}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const createLearning = async (
  name: string,
  description: string,
  category: number,
) => {
  const response = await backendRequest(`learnings/create/ `, "POST", true, {
    title: name,
    description,
    learning_category: category,
  });
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const editLearning = async (item: LearningType) => {
  const data = {
    title: item.title,
    description: item.description,
    learning_category: item.learning_category.id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    owner: item.owner,
    status: item.status,
  };
  const response = await backendRequest(
    `learnings/${item.id}/`,
    "PUT",
    true,
    data,
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const deleteLearning = async (id: string) => {
  const response = await backendRequest(`learnings/${id}`, "DELETE", true);
  return response.status;
};
