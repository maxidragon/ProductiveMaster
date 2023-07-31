import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Task } from "../../logic/interfaces";

import TaskRow from "./TaskRow";

const TasksTable = (props: {
    tasks: Task[];
}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Titlte</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell>PR</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.tasks.map((task: Task) => (
                        <TaskRow key={task.id} task={task} />
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TasksTable;