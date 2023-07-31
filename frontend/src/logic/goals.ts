import { Goal } from "./interfaces";
import { backendRequest } from "./request";

export const getAllGoals = async (): Promise<Goal[]> => {
    const response = await backendRequest("/goals/", "GET", true);
    return await response.json();
};

export const createGoal = async (title: string, deadline: Date): Promise<number> => {
    const response = await backendRequest("/goals/", "POST", true, { title, deadline });
    return response.status;
};

export const getGoalById = async (id: number): Promise<Goal> => {
    const response = await backendRequest(`/goals/${id}/`, "GET", true);
    return await response.json();
};

export const updateGoalById = async (goal: Goal): Promise<number> => {
    const response = await backendRequest(`/goals/${goal.id}/`, "PUT", true, goal);
    return response.status;
};

export const deleteGoalById = async (id: number): Promise<number> => {
    const response = await backendRequest(`/goals/${id}/`, "DELETE", true);
    return response.status;
};