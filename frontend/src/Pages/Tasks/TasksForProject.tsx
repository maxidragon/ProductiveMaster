import AddTaskIcon from '@mui/icons-material/AddTask';
import { getTasksForProject } from '../../logic/tasks';
import { CircularProgress, Box, IconButton, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import TasksTable from '../../Components/Table/TasksTable';
import { Task } from '../../logic/interfaces';
import CreateTaskModal from '../../Components/ModalComponents/Create/CreateTaskModal';

const TasksForProject = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [status, setStatus] = useState<string>("");
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
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        status === "" ? fetchData() : fetchData(status);
    }, [status, fetchData]);

    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <>
                    <Box>
                        <IconButton onClick={() => setCreateModalOpen(true)}><AddTaskIcon /></IconButton>
                    </Box>
                    <FormControl fullWidth>
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
                    <TasksTable tasks={tasks} />
                </>
            )}
            {createModalOpen && projectId && <CreateTaskModal open={createModalOpen} handleClose={handleCloseCreateModal} projectId={projectId} />}
        </>
    )
};

export default TasksForProject;