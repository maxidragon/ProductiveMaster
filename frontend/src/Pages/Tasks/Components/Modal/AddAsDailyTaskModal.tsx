import { Modal, Box, Typography } from "@mui/material";
import ActionsButtons from "../../../../Components/ModalComponents/ActionsButtons";
import { style } from "../../../../Components/ModalComponents/modalStyles";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { createDailyTask } from "../../../../logic/dailyTasks";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { TaskForProject } from "../../../../logic/interfaces";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface AddAsDailyTaskModalProps {
  open: boolean;
  handleClose: () => void;
  task: TaskForProject;
}

const AddAsDailyTaskModal = ({
  open,
  handleClose,
  task,
}: AddAsDailyTaskModalProps) => {
  const [date, setDate] = useState<Dayjs>(dayjs(new Date()));

  const handleCreate = async () => {
    const dateToSubmit = new Date(dayjs(date).toISOString());
    const description = task.description || "";
    const response = await createDailyTask(
      task.title,
      description,
      dateToSubmit,
      task.id,
    );
    if (response.status === 201) {
      enqueueSnackbar("Task added!", { variant: "success" });
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
          Add this task as daily task
        </Typography>
        <DatePicker
          value={dayjs(date)}
          onChange={(date) => setDate(dayjs(date))}
        />
        <ActionsButtons
          cancel={handleClose}
          submit={handleCreate}
          submitText={"Add"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default AddAsDailyTaskModal;
