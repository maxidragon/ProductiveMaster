import { GoalCategory } from "./interfaces";
import { backendRequest } from "./request"

export const getGoalCategories = async (): Promise<GoalCategory[]>  => {
    const response = await backendRequest("goals/categories/", "GET", true);
    const data = await response.json();
    return data.results;
};

export const createGoalCategory = async (title: string): Promise<number>  => {
    const response = await backendRequest("goals/categories/", "POST", true, { title });
    return response.status;
};

export const updateGoalCategory = async (category: GoalCategory): Promise<number> => {
    const response = await backendRequest(`goals/categories/${category.id}/`, "PUT", true, category);
    return response.status;
};

export const deleteGoalCategory = async (id: number): Promise<number>  => {
    const response = await backendRequest(`goals/categories/${id}/`, "DELETE", true);
    return response.status;
};