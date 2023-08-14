import { GoalCategory } from './interfaces';
import { backendRequest } from './request';

export const getGoalCategories = async (page: number = 1) => {
  const response = await backendRequest(
    `goals/categories/?page=${page}`,
    'GET',
    true
  );
  return await response.json();
};

export const getAllGoalCategories = async () => {
  const response = await backendRequest(`goals/categories/all/`, 'GET', true);
  return await response.json();
};
export const createGoalCategory = async (title: string): Promise<number> => {
  const response = await backendRequest('goals/categories/', 'POST', true, {
    title
  });
  return response.status;
};

export const updateGoalCategory = async (
  category: GoalCategory
): Promise<number> => {
  const response = await backendRequest(
    `goals/categories/${category.id}/`,
    'PUT',
    true,
    category
  );
  return response.status;
};

export const deleteGoalCategory = async (id: number): Promise<number> => {
  const response = await backendRequest(`goals/categories/${id}/`, 'DELETE', true);
  return response.status;
};
