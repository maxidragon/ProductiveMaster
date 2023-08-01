import { CircularProgress, Box, IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState, useEffect } from "react";
import { Project } from "../../logic/interfaces";
import { getAllProjects, getProjectsByStatus } from "../../logic/projects";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateProjectModal from "../../Components/ModalComponents/CreateProjectModal";
import ProjectsTable from "../../Components/Table/ProjectsTable";

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [status, setStatus] = useState<string>("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
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
        fetchData();
    }, []);

    useEffect(() => {
        status === "" ? fetchData() : fetchData(status);
    }, [status]);

    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <>
                    <Box>
                        <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
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
                                <MenuItem value={"PLANNED"}>Planned</MenuItem>
                                <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                                <MenuItem value={"DONE"}>Done</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <ProjectsTable projects={projects} />
                </>
            )}
            {createModalOpen && <CreateProjectModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
        </>
    )
};

export default Projects;