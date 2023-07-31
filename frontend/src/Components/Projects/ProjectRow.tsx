import { useState } from "react";
import { Link, TableRow, TableCell, IconButton } from "@mui/material";
import { Project } from "../../logic/interfaces";
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { deleteProject } from "../../logic/projects";

const ProjectRow = ({ project }: { project: Project }) => {
    const confirm = useConfirm();
    const [hide, setHide] = useState(false);
    const handleDelete = async () => {
        if (project === null) return;
        confirm({ description: "Are you sure you want to delete this project and all tasks?" }).then(async () => {
            const status = await deleteProject(project.id.toString());
            if (status === 204) {
                enqueueSnackbar("Project deleted!", { variant: "success" });
                setHide(true);
            } else {
                enqueueSnackbar("Something went wrong!", { variant: "error" });
            }
        }).catch(() => {
            enqueueSnackbar("Project not deleted!", { variant: "info" });
        });
    };

    return (
        <>
            {!hide && (
                <TableRow
                    key={project.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {project.title}
                    </TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>
                        {project.github && <IconButton component={Link} href={project.github} target="_blank">
                            <GitHubIcon />
                        </IconButton>}
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

export default ProjectRow;