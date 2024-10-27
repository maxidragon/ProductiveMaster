import { DailyTask } from "./interfaces";
import { formatDate } from "./other";
import { backendRequest } from "./request";

export const getDailyTasks = async (date: Date) => {
  const response = await backendRequest(
    `daily-tasks/${formatDate(date)}/`,
    "GET",
    true,
  );
  return await response.json();
};

export const createDailyTask = async (
  title: string,
  description: string,
  date: Date,
  taskId?: number,
) => {
  const response = await backendRequest("daily-tasks/create/", "POST", true, {
    title,
    description,
    date: formatDate(date),
    project_task: taskId,
  });
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateDailyTask = async (task: DailyTask) => {
  const response = await backendRequest(
    `daily-tasks/detail/${task.id}/`,
    "PUT",
    true,
    {
      ...task,
      project_task: task.project_task?.id,
    },
  );
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const completeDailyTask = async (task: DailyTask) => {
  const updatedTask = { ...task, completed_at: new Date() };
  return await updateDailyTask(updatedTask);
};

export const ucompleteDailyTask = async (task: DailyTask) => {
  const updatedTask = { ...task, completed_at: null };
  return await updateDailyTask(updatedTask);
};

export const deleteDailyTask = async (id: number): Promise<number> => {
  const response = await backendRequest(
    `daily-tasks/detail/${id}/`,
    "DELETE",
    true,
  );
  return response.status;
};
