import { useEffect, useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Link,
  Chip,
  Box,
} from "@mui/material";
import { Task } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { deleteTask, updateTask } from "../../../logic/tasks";
import EditTaskModal from "../../ModalComponents/Edit/EditTaskModal";
import { Link as RouterLink } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { statusPretyName } from "../../../logic/other";
import { isProjectOwner as isProjectOwnerFetch } from "../../../logic/projectParticipants";

const TaskRow = (props: {
  task: Task;
  handleStatusUpdate: (status: string) => void;
}) => {
  const userId = localStorage.getItem("userId") || "";
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(props.task);
  const handleDelete = async () => {
    if (props.task === null) return;
    confirm({ description: "Are you sure you want to delete this task?" })
      .then(async () => {
        const status = await deleteTask(props.task.id.toString());
        if (status === 204) {
          enqueueSnackbar("Task deleted!", { variant: "success" });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Task not deleted!", { variant: "info" });
      });
  };
  const editTask = (task: Task) => {
    setEditedTask(task);
  };
  const handleComplete = async () => {
    const task = { ...editedTask, status: "DONE", completed_at: new Date() };
    setEditedTask(task);
    const response = await updateTask(task);
    if (response.status === 200) {
      enqueueSnackbar("Status is successfully changed to done!", {
        variant: "success",
      });
      props.handleStatusUpdate("DONE");
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  const handleCloseEditModal = () => {
    setEdit(false);
    props.handleStatusUpdate(editedTask.status);
  };
  useEffect(() => {
    const fetchData = async () => {
      const isOwner = await isProjectOwnerFetch(editedTask.project.id);
      setIsProjectOwner(isOwner["is_owner"]);
    };
    fetchData();
  }, [editedTask.project.id]);

  return (
    <>
      {!hide && (
        <TableRow
          key={editedTask.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {editedTask.title}
            {editedTask.high_priority && (
              <Box sx={{ display: "inline-block", ml: 1 }}>
                <Chip label="High priority" color="error" />
              </Box>
            )}
          </TableCell>
          <TableCell>{editedTask.description}</TableCell>
          <TableCell>{editedTask.project.title}</TableCell>
          <TableCell>
            <IconButton
              component={RouterLink}
              to={`/tasks/project/${editedTask.project.id}`}
            >
              <AssignmentIcon />
            </IconButton>
          </TableCell>
          <TableCell>{statusPretyName(editedTask.status)}</TableCell>
          <TableCell>
            {editedTask.issue && (
              <IconButton
                component={Link}
                href={editedTask.issue}
                target="_blank"
              >
                <TaskAltIcon />
              </IconButton>
            )}
          </TableCell>
          <TableCell>
            {editedTask.pull_request && (
              <IconButton
                component={Link}
                href={editedTask.pull_request}
                target="_blank"
              >
                <AssignmentReturnedIcon />
              </IconButton>
            )}
          </TableCell>
          <TableCell>
            {editedTask.status !== "DONE" &&
              (isProjectOwner ||
                userId === editedTask.owner.toString() ||
                userId === editedTask.assignee?.toString()) && (
                <IconButton onClick={handleComplete}>
                  <CheckCircleIcon />
                </IconButton>
              )}
            {(isProjectOwner ||
              userId === editedTask.owner.toString() ||
              userId === editedTask.assignee?.toString()) && (
              <IconButton onClick={() => setEdit(true)}>
                <EditIcon />
              </IconButton>
            )}
            {(isProjectOwner || userId === editedTask.owner.toString()) && (
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </TableCell>
        </TableRow>
      )}
      {edit && (
        <EditTaskModal
          open={edit}
          handleClose={handleCloseEditModal}
          task={editedTask}
          updateTask={editTask}
        />
      )}
    </>
  );
};

export default TaskRow;
