import AddTaskIcon from '@mui/icons-material/AddTask';
import { getTasksForProject, searchTasksForProject } from '../../logic/tasks';
import { CircularProgress, Box, IconButton, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TasksTable from '../../Components/Table/TasksTable';
import { Task } from '../../logic/interfaces';
import CreateTaskModal from '../../Components/ModalComponents/Create/CreateTaskModal';

const TasksForProject = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [status, setStatus] = useState<string>("TODO");
    const [search, setSearch] = useState<string>("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetchData = useCallback(async (statusParam?: string) => {
        if (projectId === undefined) {
            return;
        }
        setLoading(true);
        if (statusParam) {
            const data = await getTasksForProject(projectId, statusParam);
            setTasks(data);
            setLoading(false);
        } else {
            const data = await getTasksForProject(projectId);
            setTasks(data);
            setLoading(false);
        }
    }, [projectId]);
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        fetchData(status);
    };

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (projectId === undefined) {
            return;
        }
        setSearch(event.target.value);
        if (status === "") {
            if (event.target.value === "") {
                fetchData();
                return;
            }
            const filteredTasks = await searchTasksForProject(event.target.value, +projectId);
            setTasks(filteredTasks);
        } else {
            if (event.target.value === "") {
                fetchData(status);
                return;
            }
            const filteredTasks = await searchTasksForProject(event.target.value, +projectId, status);
            setTasks(filteredTasks);
        }
        if (event.target.value === "") {
            fetchData(status);
            return;
        }
    };

    useEffect(() => {
        fetchData(status);
    }, [fetchData, status]);

    useEffect(() => {
        status === "" ? fetchData() : fetchData(status);
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
                <TasksTable tasks={tasks} />
            )}
            {createModalOpen && projectId && <CreateTaskModal open={createModalOpen} handleClose={handleCloseCreateModal} projectId={projectId} />}
        </>
    )
};

export default TasksForProject;