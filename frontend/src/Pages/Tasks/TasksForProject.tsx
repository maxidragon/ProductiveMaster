import AddTaskIcon from '@mui/icons-material/AddTask';
import { getTasksForProject, searchTasksForProject } from '../../logic/tasks';
import { CircularProgress, Box, IconButton, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TasksTable from '../../Components/Table/TasksTable';
import { Task } from '../../logic/interfaces';
import CreateTaskModal from '../../Components/ModalComponents/Create/CreateTaskModal';
import { calculateTotalPages } from '../../logic/other';

const TasksForProject = () => {
    const perPage = 10;
    const { projectId } = useParams<{ projectId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [status, setStatus] = useState<string>("TODO");
    const [search, setSearch] = useState<string>("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const fetchData = useCallback(async (pageParam: number, statusParam?: string) => {
        if (projectId === undefined) {
            return;
        }
        setLoading(true);
        if (statusParam !== undefined && statusParam !== "") {
            const data = await getTasksForProject(projectId, pageParam, statusParam);
            const totalPagesNumber = calculateTotalPages(data.count, perPage);
            setTotalPages(totalPagesNumber);
            setPage(pageParam);
            setTasks(data.results);
            setLoading(false);
        } else {
            const data = await getTasksForProject(projectId, pageParam);
            const totalPagesNumber = calculateTotalPages(data.count, perPage);
            setTotalPages(totalPagesNumber);
            setPage(pageParam);
            setTasks(data.results);
            setLoading(false);
        }
    }, [projectId]);
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
                filteredTasks = await searchTasksForProject(search, +projectId, pageParam);
            } else {
                filteredTasks = await searchTasksForProject(search, +projectId, pageParam, status);
            }
        } else {
            filteredTasks = await getTasksForProject(projectId, pageParam, status);
        }
        setTasks(filteredTasks.results);
        setPage(pageParam);
        const totalPagesNumber = calculateTotalPages(filteredTasks.count, perPage);
        setTotalPages(totalPagesNumber);
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
            const filteredTasks = await searchTasksForProject(event.target.value, +projectId, 1);
            setTasks(filteredTasks.results);
            setPage(1);
            const totalPagesNumber = calculateTotalPages(filteredTasks.count, perPage);
            setTotalPages(totalPagesNumber);
        } else {
            if (event.target.value === "") {
                fetchData(1, status);
                return;
            }
            const filteredTasks = await searchTasksForProject(event.target.value, +projectId, 1, status);
            setTasks(filteredTasks.results);
            setPage(1);
            const totalPagesNumber = calculateTotalPages(filteredTasks.count, perPage);
            setTotalPages(totalPagesNumber);
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
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
                <FormControl sx={{ width: '50%', mr: 2 }}>
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
                <TextField fullWidth label="Search" variant="outlined" value={search} onChange={handleSearch} />
                <IconButton onClick={() => setCreateModalOpen(true)}><AddTaskIcon /></IconButton>
            </Box>
            {loading ? (
                <CircularProgress />) : (
                <TasksTable tasks={tasks} page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
            )}
            {createModalOpen && projectId && <CreateTaskModal open={createModalOpen} handleClose={handleCloseCreateModal} projectId={projectId} />}
        </>
    )
};

export default TasksForProject;