import { useState } from "react";
import { TableRow, TableCell, IconButton, Link } from "@mui/material";
import { Task } from "../../logic/interfaces";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { deleteTask, updateTask } from "../../logic/tasks";
import EditTaskModal from "../ModalComponents/EditTaskModal";
const TaskRow = ({ task }: { task: Task }) => {
    const confirm = useConfirm();
    const [hide, setHide] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    const handleDelete = async () => {
        if (task === null) return;
        confirm({ description: "Are you sure you want to delete this task?" }).then(async () => {
            const status = await deleteTask(task.id.toString());
            if (status === 204) {
                enqueueSnackbar("Task deleted!", { variant: "success" });
                setHide(true);
            } else {
                enqueueSnackbar("Something went wrong!", { variant: "error" });
            }
        }).catch(() => {
            enqueueSnackbar("Task not deleted!", { variant: "info" });
        });
    };
    const editTask = (task: Task) => {
        setEditedTask(task);
    };
    const handleComplete = async () => {
        const task = { ...editedTask, status: "DONE" };
        setEditedTask(task);
        const status = await updateTask(task);
        if (status === 200) {
          enqueueSnackbar("Status is successfully changed to done!", { variant: "success" });
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
    };

    return (
        <>
            {!hide && (
                <TableRow
                    key={editedTask.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {editedTask.title}
                    </TableCell>
                    <TableCell>{editedTask.description}</TableCell>
                    <TableCell>{editedTask.status}</TableCell>
                    <TableCell>{editedTask.issue && <IconButton component={Link} href={editedTask.issue} target="_blank"><TaskAltIcon /></IconButton>}</TableCell>
                    <TableCell>{editedTask.pull_request && <IconButton component={Link} href={editedTask.pull_request} target="_blank"><AssignmentReturnedIcon /></IconButton>}</TableCell>
                    <TableCell>
                        <IconButton onClick={handleComplete}>
                            <CheckCircleIcon />
                        </IconButton>
                        <IconButton onClick={() => setEdit(true)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )}
            {edit && <EditTaskModal open={edit} handleClose={() => setEdit(false)} task={editedTask} updateTask={editTask} />}
        </>
    );
};

export default TaskRow;