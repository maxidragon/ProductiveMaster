import { LearningCategory } from "./interfaces";
import { backendRequest } from "./request";

export const getAllLearningCategories = async () => {
  const response = await backendRequest(
    `learnings/categories/all`,
    "GET",
    true,
  );
  return await response.json();
};

export const getLearningCategories = async (page = 1) => {
  const response = await backendRequest(
    `learnings/categories/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const createLearningCategory = async (name: string) => {
  const response = await backendRequest(`learnings/categories/`, "POST", true, {
    name,
  });
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateLearningCategory = async (category: LearningCategory) => {
  const response = await backendRequest(
    `learnings/categories/${category.id}/   `,
    "PUT",
    true,
    category,
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};
export const deleteLearningCategory = async (id: number) => {
  const response = await backendRequest(
    `learnings/categories/${id}`,
    "DELETE",
    true,
  );
  return response.status;
};
