import { Modal, Box, Typography, TextField } from "@mui/material";
import ActionsButtons from "../../../Components/ModalComponents/ActionsButtons";
import { style } from "../../../Components/ModalComponents/modalStyles";
import { DailyTask } from "../../../logic/interfaces";
import { formatDate } from "../../../logic/other";
import { useState } from "react";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { updateDailyTask } from "../../../logic/dailyTasks";
import { enqueueSnackbar } from "notistack";

interface EditDailyTaskModalProps {
  open: boolean;
  handleClose: () => void;
  task: DailyTask;
}

const EditDailyTaskModal = ({
  open,
  handleClose,
  task,
}: EditDailyTaskModalProps) => {
  const [editedTask, setEditedTask] = useState<DailyTask>(task);

  const handleSubmit = async () => {
    const response = await updateDailyTask(editedTask);

    if (response.status === 200) {
      enqueueSnackbar("Task updated!", { variant: "success" });
      handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Title: ${error}`, { variant: "error" });
        });
      }
      if (response.data.description) {
        response.data.description.forEach((error: string) => {
          enqueueSnackbar(`Description: ${error}`, { variant: "error" });
        });
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create task for {formatDate(new Date(task.date))}
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
        />
        <TextField
          multiline
          rows={5}
          placeholder={"Write task description here..."}
          fullWidth
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
        />
        <ActionsButtons
          cancel={handleClose}
          submit={handleSubmit}
          submitText={"Update"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default EditDailyTaskModal;
