import { useState, useCallback, useEffect } from "react";
import { Task } from "../../logic/interfaces";
import { getTasksByStatus, searchTasks } from "../../logic/tasks";
import {
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import TasksTable from "./Components/TasksTable";
import { calculateTotalPages } from "../../logic/other";

const Tasks = () => {
  const perPage = 10;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("TODO");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (pageParam: number, statusParam?: string) => {
      if (statusParam === undefined || statusParam === "") {
        return;
      }
      const data = await getTasksByStatus(statusParam, pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
      setTotalPages(totalPagesNumber);
      setTotalItems(data.count);
      setPage(pageParam);
      setTasks(data.results);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    },
    [],
  );

  useEffect(() => {
    setTotalPages(1);
    setPage(1);
    fetchData(1, status);
  }, [status, fetchData]);

  const handlePageChange = async (pageParam: number) => {
    if (search !== "") {
      const filteredTasks = await searchTasks(search, status, pageParam);
      setTasks(filteredTasks.results);
      setPage(pageParam);
      const totalPagesNumber = calculateTotalPages(
        filteredTasks.count,
        perPage,
      );
      setTotalPages(totalPagesNumber);
      setTotalItems(filteredTasks.count);
    } else {
      await fetchData(pageParam, status);
    }
  };
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    if (event.target.value === "") {
      fetchData(page, status);
      return;
    }
    const filteredTasks = await searchTasks(event.target.value, status);
    setTasks(filteredTasks.results);
    setPage(1);
    const totalPagesNumber = calculateTotalPages(filteredTasks.count, perPage);
    setTotalPages(totalPagesNumber);
    setTotalItems(filteredTasks.count);
  };
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
        <FormControl sx={{ width: "50%", mr: 2 }}>
          <InputLabel id="status">Status</InputLabel>
          <Select
            labelId="status"
            label="Status"
            required
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <MenuItem value={"TODO"}>To do</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ width: "50%" }}
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
        />
      </Box>
      {loading ? (
        <LinearProgress />
      ) : (
        <TasksTable
          tasks={tasks}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
          status={status}
          fetchData={fetchData}
        />
      )}
    </>
  );
};

export default Tasks;
