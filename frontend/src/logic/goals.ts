import { Goal } from "./interfaces";
import { backendRequest } from "./request";

export const getAllGoals = async (): Promise<Goal[]> => {
    const response = await backendRequest("goals/", "GET", true);
    return await response.json();
};

export const getGoalsByCategoryId = async (id: number): Promise<Goal[]> => {
    const response = await backendRequest(`goals/category/${id}/`, "GET", true);
    return await response.json();
};

export const createGoal = async (title: string, description: string, deadline: Date): Promise<number> => {
    const deadlineDate = new Date(deadline);
    const response = await backendRequest("goals/", "POST", true, { title, description, deadline: deadlineDate });
    return response.status;
};

export const getGoalById = async (id: number): Promise<Goal> => {
    const response = await backendRequest(`goals/${id}/`, "GET", true);
    return await response.json();
};

export const updateGoalById = async (goal: Goal): Promise<number> => {
    const response = await backendRequest(`goals/${goal.id}/`, "PUT", true, goal);
    return response.status;
};

export const deleteGoalById = async (id: number): Promise<number> => {
    const response = await backendRequest(`goals/${id}/`, "DELETE", true);
    return response.status;
};