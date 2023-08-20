import { CreateGoal, EditGoal, Goal } from "./interfaces";
import { backendRequest } from "./request";

export const getAllGoals = async (page = 1) => {
  const response = await backendRequest(`goals/?page=${page}`, "GET", true);
  return await response.json();
};

export const getGoalsByCategoryId = async (id: number, page = 1) => {
  const response = await backendRequest(
    `goals/category/${id}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};

export const createGoal = async (data: CreateGoal) => {
  const deadlineDate = new Date(data.deadline_string);
  data.deadline = deadlineDate;
  const response = await backendRequest("goals/create/", "POST", true, data);
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const getGoalById = async (id: number): Promise<Goal> => {
  const response = await backendRequest(`goals/${id}/`, "GET", true);
  return await response.json();
};

export const updateGoalById = async (goal: EditGoal) => {
  const response = await backendRequest(`goals/${goal.id}/`, "PUT", true, goal);
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const deleteGoalById = async (id: number): Promise<number> => {
  const response = await backendRequest(`goals/${id}/`, "DELETE", true);
  return response.status;
};
