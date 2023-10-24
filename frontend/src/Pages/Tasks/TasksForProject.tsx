import AddTaskIcon from "@mui/icons-material/AddTask";
import { getTasksForProject, searchTasksForProject } from "../../logic/tasks";
import {
  Box,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  LinearProgress,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TaskForProject } from "../../logic/interfaces";
import CreateTaskModal from "../../Components/ModalComponents/Create/CreateTaskModal";
import { calculateTotalPages } from "../../logic/other";
import TasksForProjectTable from "../../Components/Table/TasksForProjectTable";

const TasksForProject = () => {
  const perPage = 10;
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<TaskForProject[]>([]);
  const [status, setStatus] = useState<string>("TODO");
  const [search, setSearch] = useState<string>("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(
    async (pageParam: number, statusParam?: string) => {
      if (projectId === undefined) {
        return;
      }
      if (statusParam !== undefined && statusParam !== "") {
        const data = await getTasksForProject(
          projectId,
          pageParam,
          statusParam,
        );
        const totalPagesNumber = calculateTotalPages(data.count, perPage);
        setTotalPages(totalPagesNumber);
        setTotalItems(data.count);
        setPage(pageParam);
        setTasks(data.results);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      } else {
        const data = await getTasksForProject(projectId, pageParam);
        const totalPagesNumber = calculateTotalPages(data.count, perPage);
        setTotalPages(totalPagesNumber);
        setTotalItems(data.count);
        setPage(pageParam);
        setTasks(data.results);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    },
    [projectId],
  );
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    fetchData(1, status);
  };

  const handlePageChange = async (pageParam: number) => {
    if (projectId === undefined) {
      return;
    }
    let filteredTasks;
    if (search !== "") {
      if (status === "") {
        filteredTasks = await searchTasksForProject(
          search,
          +projectId,
          pageParam,
        );
      } else {
        filteredTasks = await searchTasksForProject(
          search,
          +projectId,
          pageParam,
          status,
        );
      }
    } else {
      filteredTasks = await getTasksForProject(projectId, pageParam, status);
    }
    setTasks(filteredTasks.results);
    setPage(pageParam);
    const totalPagesNumber = calculateTotalPages(filteredTasks.count, perPage);
    setTotalPages(totalPagesNumber);
    setTotalItems(filteredTasks.count);
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (projectId === undefined) {
      return;
    }
    setSearch(event.target.value);
    if (status === "") {
      if (event.target.value === "") {
        fetchData(page);
        return;
      }
      const filteredTasks = await searchTasksForProject(
        event.target.value,
        +projectId,
        1,
      );
      setTasks(filteredTasks.results);
      setPage(1);
      const totalPagesNumber = calculateTotalPages(
        filteredTasks.count,
        perPage,
      );
      setTotalPages(totalPagesNumber);
      setTotalItems(filteredTasks.count);
    } else {
      if (event.target.value === "") {
        fetchData(1, status);
        return;
      }
      const filteredTasks = await searchTasksForProject(
        event.target.value,
        +projectId,
        1,
        status,
      );
      setTasks(filteredTasks.results);
      setPage(1);
      const totalPagesNumber = calculateTotalPages(
        filteredTasks.count,
        perPage,
      );
      setTotalPages(totalPagesNumber);
      setTotalItems(filteredTasks.count);
    }
    if (event.target.value === "") {
      fetchData(1, status);
      return;
    }
  };

  useEffect(() => {
    setTotalPages(1);
    setPage(1);
    fetchData(1, status);
  }, [status, fetchData]);

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
            <MenuItem value={""}>All</MenuItem>
            <MenuItem value={"TODO"}>To do</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
        />
        <IconButton onClick={() => setCreateModalOpen(true)}>
          <AddTaskIcon />
        </IconButton>
      </Box>
      {loading ? (
        <LinearProgress />
      ) : (
        <TasksForProjectTable
          tasks={tasks}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
          status={status}
          fetchData={fetchData}
        />
      )}
      {createModalOpen && projectId && (
        <CreateTaskModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
          projectId={projectId}
        />
      )}
    </>
  );
};

export default TasksForProject;
