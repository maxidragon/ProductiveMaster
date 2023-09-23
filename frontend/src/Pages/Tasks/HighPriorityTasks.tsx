import { useState, useCallback, useEffect } from "react";
import { Task } from "../../logic/interfaces";
import { getHighPriorityTasks } from "../../logic/tasks";
import { LinearProgress } from "@mui/material";
import TasksTable from "../../Components/Table/TasksTable";
import { calculateTotalPages } from "../../logic/other";

const HighPriorityTasks = () => {
  const perPage = 10;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (pageParam: number) => {
    const data = await getHighPriorityTasks(pageParam);
    const totalPagesNumber = calculateTotalPages(data.count, perPage);
    setTotalPages(totalPagesNumber);
    setTotalItems(data.count);
    setPage(pageParam);
    setTasks(data.results);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    setTotalPages(1);
    setPage(1);
    fetchData(1);
  }, [fetchData]);

  const handlePageChange = async (pageParam: number) => {
    await fetchData(pageParam);
  };

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <TasksTable
          tasks={tasks}
          multipleProjects={true}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
          fetchData={fetchData}
        />
      )}
    </>
  );
};

export default HighPriorityTasks;
