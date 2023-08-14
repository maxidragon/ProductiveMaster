import { useState, useCallback, useEffect } from "react";
import { Task } from "../../logic/interfaces";
import { getTasksByStatus, searchTasks } from "../../logic/tasks";
import { CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Box } from "@mui/material";
import TasksTable from "../../Components/Table/TasksTable";
import { calculateTotalPages } from "../../logic/other";

const Tasks = () => {
    const perPage = 10;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState<string>("");
    const [status, setStatus] = useState<string>("TODO");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (statusParam: string, pageParam: number) => {
        setLoading(true);
        const data = await getTasksByStatus(statusParam, pageParam);
        const totalPagesNumber = calculateTotalPages(data.count, perPage);
        setTotalPages(totalPagesNumber);
        setPage(pageParam);
        setTasks(data.results);
        setLoading(false);

    }, []);

    useEffect(() => {
        setTotalPages(1);
        setPage(1);
        fetchData(status, 1);
    }, [status, fetchData]);

    const handlePageChange = async (pageParam: number) => {
        if (search !== "") {
            const filteredTasks = await searchTasks(search, status, pageParam);
            setTasks(filteredTasks.results);
            setPage(pageParam);
            const totalPagesNumber = calculateTotalPages(filteredTasks.count, perPage);
            setTotalPages(totalPagesNumber);
        } else {
            await fetchData(status, pageParam);
        }
    };
    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value === "") {
            fetchData(status, page);
            return;
        }
        const filteredTasks = await searchTasks(event.target.value, status);
        setTasks(filteredTasks.results);
        setPage(1);
        const totalPagesNumber = calculateTotalPages(filteredTasks.count, perPage);
        setTotalPages(totalPagesNumber);
    };
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
                        <MenuItem value={"TODO"}>To do</MenuItem>
                        <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                        <MenuItem value={"DONE"}>Done</MenuItem>
                    </Select>
                </FormControl>
                <TextField sx={{ width: '50%' }} label="Search" variant="outlined" value={search} onChange={handleSearch} />
            </Box>
            {loading ? (
                <CircularProgress />) : (
                <TasksTable tasks={tasks} multipleProjects={true} page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
            )}
        </>
    )
};

export default Tasks;