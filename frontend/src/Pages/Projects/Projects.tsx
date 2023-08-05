import { CircularProgress, Box, IconButton, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Project } from "../../logic/interfaces";
import { getAllProjects, getProjectsByStatus, searchProjects } from "../../logic/projects";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateProjectModal from "../../Components/ModalComponents/Create/CreateProjectModal";
import ProjectsTable from "../../Components/Table/ProjectsTable";

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [status, setStatus] = useState<string>("IN_PROGRESS");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const fetchData = async (status?: string) => {
        setLoading(true);
        if (status) {
            const data = await getProjectsByStatus(status);
            setProjects(data);
            setLoading(false);
        } else {
            const data = await getAllProjects();
            setProjects(data);
            setLoading(false);
        }
    };
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        fetchData();
    };

    useEffect(() => {
        fetchData(status);
    }, [status]);

    useEffect(() => {
        status === "" ? fetchData() : fetchData(status);
    }, [status]);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value === "") {
            fetchData();
            return;
        }
        const filteredProjects = await searchProjects(event.target.value);
        setProjects(filteredProjects);
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
                <ProjectsTable projects={projects} />
            )}
            {createModalOpen && <CreateProjectModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
        </>
    )
};

export default Projects;