import { DailyTask } from "../../../logic/interfaces";
import {
  Close as CloseIcon,
  Done as DoneIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import {
  completeDailyTask,
  deleteDailyTask,
  ucompleteDailyTask,
} from "../../../logic/dailyTasks";
import { useConfirm } from "material-ui-confirm";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import EditDailyTaskModal from "./EditDailyTaskModal";
import { useState } from "react";

interface TaskItemProps {
  task: DailyTask;
  fetchData: () => void;
}

const TaskItem = ({ task, fetchData }: TaskItemProps) => {
  const confirm = useConfirm();
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const handleDelete = async () => {
    confirm({
      description: "Are you sure you want to delete this task?",
    })
      .then(async () => {
        const response = await deleteDailyTask(task.id);
        if (response === 204) {
          enqueueSnackbar("Task deleted!", { variant: "success" });
          fetchData();
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => enqueueSnackbar("Task not deleted!", { variant: "info" }));
  };

  const handleComplete = async () => {
    const response = await completeDailyTask(task);
    if (response.status === 200) {
      enqueueSnackbar("Task completed!", { variant: "success" });
      fetchData();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  const handleUncomplete = async () => {
    const response = await ucompleteDailyTask(task);
    if (response.status === 200) {
      enqueueSnackbar("Task uncompleted!", { variant: "success" });
      fetchData();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  if (!task) return null;

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => setIsOpenEditModal(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete()}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
      >
        {task.completed_at ? (
          <ListItemAvatar>
            <IconButton aria-label="uncomplete" onClick={handleUncomplete}>
              <CloseIcon />
            </IconButton>
          </ListItemAvatar>
        ) : (
          <ListItemAvatar>
            <IconButton aria-label="complete" onClick={handleComplete}>
              <DoneIcon />
            </IconButton>
          </ListItemAvatar>
        )}
        <ListItemText primary={task.title} secondary={task.description || ""} />
      </ListItem>
      <EditDailyTaskModal
        open={isOpenEditModal}
        handleClose={() => {
          setIsOpenEditModal(false);
          fetchData();
        }}
        task={task}
      />
    </>
  );
};

export default TaskItem;
