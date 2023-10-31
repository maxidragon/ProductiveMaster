import { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Link,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import { Task, TaskForProject } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { deleteTask, updateTask } from "../../../logic/tasks";
import EditTaskModal from "../../ModalComponents/Edit/EditTaskModal";
import { statusPretyName } from "../../../logic/other";
import AvatarComponent from "../../AvatarComponent";

const TasksForProjectRow = (props: {
  task: TaskForProject;
  isProjectOwner: boolean;
  handleStatusUpdate: (status: string) => void;
}) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskForProject>(props.task);
  const [taskOwner] = useState(props.task.owner);
  const [taskAssignee] = useState(props.task.assignee);

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
    const taskToSet = {
      ...task,
      owner: taskOwner,
      assignee: taskAssignee,
    };
    setEditedTask(taskToSet);
  };
  const handleComplete = async () => {
    const task = { ...editedTask, status: "DONE", completed_at: new Date() };
    setEditedTask(task);
    const response = await updateTask({
      ...task,
      owner: task.owner.id,
      assignee: task.assignee?.id,
    });
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
          <TableCell>{statusPretyName(editedTask.status)}</TableCell>
          <TableCell>
            <Tooltip title={editedTask.owner.username}>
              <IconButton>
                <AvatarComponent
                  userId={editedTask.owner.id}
                  username={editedTask.owner.username}
                  size="30px"
                />
              </IconButton>
            </Tooltip>
          </TableCell>
          <TableCell>
            {editedTask.assignee && (
              <Tooltip title={editedTask.assignee.username}>
                <IconButton>
                  <AvatarComponent
                    userId={editedTask.assignee.id}
                    username={editedTask.assignee.username}
                    size="30px"
                  />
                </IconButton>
              </Tooltip>
            )}
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
              (props.isProjectOwner ||
                localStorage.getItem("userId") ===
                  editedTask.owner.id.toString() ||
                localStorage.getItem("userId") ===
                  editedTask.assignee.id.toString()) && (
                <IconButton onClick={handleComplete}>
                  <CheckCircleIcon />
                </IconButton>
              )}
            {(props.isProjectOwner ||
              localStorage.getItem("userId") ===
                editedTask.owner.id.toString()) && (
              <>
                <IconButton onClick={() => setEdit(true)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </TableCell>
        </TableRow>
      )}
      {edit && (
        <EditTaskModal
          open={edit}
          handleClose={handleCloseEditModal}
          task={{
            ...editedTask,
            owner: editedTask.owner.id,
            assignee: editedTask.assignee?.id,
          }}
          updateTask={editTask}
        />
      )}
    </>
  );
};

export default TasksForProjectRow;
