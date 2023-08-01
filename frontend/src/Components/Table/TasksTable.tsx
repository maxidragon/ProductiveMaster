import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Task } from "../../logic/interfaces";

import TaskRow from "./Row/TaskRow";

const TasksTable = (props: {
    tasks: Task[];
    multipleProjects?: boolean;
}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Titlte</TableCell>
                        <TableCell>Description</TableCell>
                        {props.multipleProjects && <TableCell>Project</TableCell>}
                        {props.multipleProjects && <TableCell>Tasks for project</TableCell>}
                        <TableCell>Status</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell>PR</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.tasks.map((task: Task) => (
                        <TaskRow key={task.id} task={task} multipleProjects={props.multipleProjects} />
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TasksTable;