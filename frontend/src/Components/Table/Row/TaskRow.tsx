import { useEffect, useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Link,
  Chip,
  Box,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  AssignmentReturned as AssignmentReturnedIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TaskAlt as TaskAltIcon,
} from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { Task } from "../../../logic/interfaces";
import { deleteTask, updateTask } from "../../../logic/tasks";
import { Link as RouterLink } from "react-router-dom";
import { statusPretyName } from "../../../logic/other";
import { isProjectOwner as isProjectOwnerFetch } from "../../../logic/projectParticipants";
import EditTaskModal from "../../ModalComponents/Edit/EditTaskModal";

interface Props {
  task: Task;
  handleStatusUpdate: (status: string) => void;
}

const TaskRow = ({ task, handleStatusUpdate }: Props): JSX.Element => {
  const userId = localStorage.getItem("userId") || "";
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleDelete = async (): Promise<void> => {
    if (task === null) return;
    confirm({ description: "Are you sure you want to delete this task?" })
      .then(async () => {
        const status = await deleteTask(task.id.toString());
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
  const editTask = (task: Task): void => {
    setEditedTask(task);
  };
  const handleComplete = async (): Promise<void> => {
    const task = { ...editedTask, status: "DONE", completed_at: new Date() };
    setEditedTask(task);
    const response = await updateTask(task);
    if (response.status === 200) {
      enqueueSnackbar("Status is successfully changed to done!", {
        variant: "success",
      });
      handleStatusUpdate("DONE");
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  const handleCloseEditModal = (): void => {
    setEdit(false);
    handleStatusUpdate(editedTask.status);
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
          <TableCell>
            <Box sx={{ display: "inline-block", ml: 1 }}>
              <Chip
                label={statusPretyName(editedTask.status)}
                color={
                  editedTask.status === "TODO"
                    ? "primary"
                    : editedTask.status === "IN_PROGRESS"
                    ? "warning"
                    : "success"
                }
              />
            </Box>
          </TableCell>
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
          editTask={editTask}
        />
      )}
    </>
  );
};

export default TaskRow;
