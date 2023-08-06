import { CircularProgress, Box, IconButton, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { Project } from "../../logic/interfaces";
import { getAllProjects, getProjectsByStatus, searchProjects } from "../../logic/projects";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateProjectModal from "../../Components/ModalComponents/Create/CreateProjectModal";
import ProjectsTable from "../../Components/Table/ProjectsTable";
import { calculateTotalPages } from "../../logic/other";
import { enqueueSnackbar } from "notistack";

const Projects = () => {
    const perPage = 10;
    const [projects, setProjects] = useState<Project[]>([]);
    const [status, setStatus] = useState<string>("IN_PROGRESS");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const fetchData = async (pageParam: number = 1, status?: string) => {
        setLoading(true);
        if (status !== undefined && status !== "") {
            const data = await getProjectsByStatus(status, pageParam);
            setProjects(data.results);
            const totalPagesNumber = calculateTotalPages(data.count, perPage);
            setTotalPages(totalPagesNumber);
            setPage(pageParam);
            setLoading(false);
        } else {
            const data = await getAllProjects(pageParam);
            setProjects(data.results);
            const totalPagesNumber = calculateTotalPages(data.count, perPage);
            setTotalPages(totalPagesNumber);
            setPage(pageParam);
            setLoading(false);
        }
    };
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        fetchData();
    };
    const handlePageChange = async (pageParam: number) => {
        let filteredProjects;
        if (search !== "") {
            if (status === "") {
                filteredProjects = await searchProjects(search, pageParam);
            } else {
                filteredProjects = await searchProjects(search, pageParam, status);
            }
        } else {
            if (status === "") {
                filteredProjects = await getAllProjects(pageParam);
            } else {
                filteredProjects = await getProjectsByStatus(status, pageParam);
            }
        }
        if (filteredProjects.detail && filteredProjects.detail === "Invalid page.") {
            enqueueSnackbar("Invalid page!", { variant: "error" });
            setPage(pageParam - 1);
            setTotalPages(totalPages - 1);
            return;
        }
        setProjects(filteredProjects.results);
        setPage(pageParam);
        const totalPagesNumber = calculateTotalPages(filteredProjects.count, perPage);
        setTotalPages(totalPagesNumber);
    };
    
    const handleSearch = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value === "") {
            fetchData();
            return;
        }
        let filteredProjects;
        if (status === "") {
            filteredProjects = await searchProjects(event.target.value);
        } else {
            filteredProjects = await searchProjects(event.target.value, 1, status);
        }
        setProjects(filteredProjects.results);
        setPage(1);
        const totalPagesNumber = calculateTotalPages(filteredProjects.count, perPage);
        setTotalPages(totalPagesNumber);
    }, [status]);

    useEffect(() => {
        if (search === "") {
            fetchData(1, status);
        } else {
            handleSearch({ target: { value: search } } as React.ChangeEvent<HTMLInputElement>);
        }
    }, [status, search, handleSearch]);


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
                        <MenuItem value={"PLANNED"}>Planned</MenuItem>
                        <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                        <MenuItem value={"DONE"}>Done</MenuItem>
                    </Select>
                </FormControl>
                <TextField fullWidth label="Search" variant="outlined" value={search} onChange={handleSearch} />
                <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
            </Box>
            {loading ? (
                <CircularProgress />) : (
                <ProjectsTable projects={projects} page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
            )}
            {createModalOpen && <CreateProjectModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
        </>
    )
};

export default Projects;