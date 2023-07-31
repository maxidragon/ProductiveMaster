import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Link } from "@mui/material";
import { Project } from "../../logic/interfaces";
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectsTable = (props: {
    projects: Project[];
}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Titlte</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.projects.map((project: Project) => (
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
                                <IconButton>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectsTable;