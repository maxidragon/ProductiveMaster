import { style } from "../modalStyles";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers";
import { createActivity } from "../../../logic/activities";
import { ModalProps } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

const CreateActivityModal = ({
  open,
  handleClose,
}: ModalProps): JSX.Element => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const descriptionRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  //eslint-disable-next-line
  const startTimeRef: any = useRef();
  //eslint-disable-next-line
  const endTimeRef: any = useRef();
  const handleCreate = async () => {
    if (!titleRef.current || !descriptionRef.current) return;
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const response = await createActivity(
      title,
      description,
      startTimeRef.current.value,
      endTimeRef.current.value,
    );
    if (response.status === 201) {
      enqueueSnackbar("Activity created!", { variant: "success" });
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
      if (response.data.start_time) {
        response.data.start_time.forEach((error: string) => {
          enqueueSnackbar(`Start time: ${error}`, { variant: "error" });
        });
      }
      if (response.data.end_time) {
        response.data.end_time.forEach((error: string) => {
          enqueueSnackbar(`End time: ${error}`, { variant: "error" });
        });
      }
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create activity
        </Typography>
        <DateTimePicker label="Start" inputRef={startTimeRef} />
        <DateTimePicker label="End" inputRef={endTimeRef} />
        <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
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

export default CreateActivityModal;
