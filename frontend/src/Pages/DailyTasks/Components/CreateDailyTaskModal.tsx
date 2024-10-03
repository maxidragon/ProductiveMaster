import { Modal, Box, Typography, TextField } from "@mui/material";
import ActionsButtons from "../../../Components/ModalComponents/ActionsButtons";
import { style } from "../../../Components/ModalComponents/modalStyles";
import { formatDate } from "../../../logic/other";
import { enqueueSnackbar } from "notistack";
import { useRef } from "react";
import { createDailyTask } from "../../../logic/dailyTasks";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";

interface CreateDailyTaskModalProps {
  open: boolean;
  handleClose: () => void;
  date: Date;
}

const CreateDailyTaskModal = ({
  open,
  handleClose,
  date,
}: CreateDailyTaskModalProps) => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const descriptionRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !descriptionRef.current) return;
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const response = await createDailyTask(title, description, date);
    if (response.status === 201) {
      enqueueSnackbar("Task created!", { variant: "success" });
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
          Create task for {formatDate(date)}
        </Typography>
        <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
        <TextField
          multiline
          rows={5}
          placeholder={"Write task description here..."}
          fullWidth
          inputRef={descriptionRef}
        />

        <ActionsButtons
          cancel={handleClose}
          submit={handleCreate}
          submitText={"Create"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default CreateDailyTaskModal;
