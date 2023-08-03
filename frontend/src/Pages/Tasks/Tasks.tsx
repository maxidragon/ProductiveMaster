import { useState, useCallback, useEffect } from "react";
import { Task } from "../../logic/interfaces";
import { getTasksByStatus, searchTasks } from "../../logic/tasks";
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Box } from "@mui/material";
import TasksTable from "../../Components/Table/TasksTable";

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState<string>("");
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

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value === "") {
            fetchData(status);
            return;
        }
        const filteredTasks = await searchTasks(event.target.value, status);
        setTasks(filteredTasks);
    };
    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
                        <FormControl sx={{width: '50%', mr: 2}}>
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
                        <TextField sx={{width: '50%'}} label="Search" variant="outlined" value={search} onChange={handleSearch} />
                    </Box>

                    <TasksTable tasks={tasks} multipleProjects={true} />
                </>
            )}
        </>
    )
};

export default Tasks;