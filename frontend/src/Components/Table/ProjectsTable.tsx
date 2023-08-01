import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Project } from "../../logic/interfaces";

import ProjectRow from "./Row/ProjectRow";

const ProjectsTable = (props: {
    projects: Project[];
}) => {
    console.log(props.projects);
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Titlte</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Tasks (TODO, in progress, done)</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.projects.map((project: Project) => (
                        <ProjectRow key={project.id} project={project} />
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectsTable;