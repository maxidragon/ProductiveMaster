import { useState, useCallback, useEffect } from "react";
import { Task } from "../../logic/interfaces";
import { getTasksByStatus } from "../../logic/tasks";
import { CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import TasksTable from "../../Components/Table/TasksTable";

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [status, setStatus] = useState<string>("TODO");
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (statusParam: string) => {
        setLoading(true);
        const data = await getTasksByStatus(statusParam);
        setTasks(data);
        setLoading(false);

    }, []);

    useEffect(() => {
        fetchData(status);
    }, [status, fetchData]);
    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <>
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
                            <MenuItem value={"TODO"}>To do</MenuItem>
                            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                            <MenuItem value={"DONE"}>Done</MenuItem>
                        </Select>
                    </FormControl>
                    <TasksTable tasks={tasks} multipleProjects={true} />
                </>
            )}
        </>
    )
};

export default Tasks;