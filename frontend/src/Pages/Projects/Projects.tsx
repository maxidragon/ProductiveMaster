import { CircularProgress, Box, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { Project, ProjectStatus } from "../../logic/interfaces";
import { getAllProjects, getProjectsByStatus } from "../../logic/projects";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateProjectModal from "../../Components/ModalComponents/CreateProjectModal";
import ProjectsTable from "../../Components/Projects/ProjectsTable";

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetchData = async (status?: ProjectStatus) => {
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
    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <>
                    <Box>
                        <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
                    </Box>
                    <ProjectsTable projects={projects} />
                </>
            )}
            {createModalOpen && <CreateProjectModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
        </>
    )
};

export default Projects;