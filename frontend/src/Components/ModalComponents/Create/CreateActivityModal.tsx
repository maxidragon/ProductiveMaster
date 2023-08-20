import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers";
import { createActivity } from "../../../logic/activities";
import ActionsButtons from "../ActionsButtons";

const CreateActivityModal = (props: {
  open: boolean;
  handleClose: () => void;
}) => {
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
      props.handleClose();
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
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create activity
            </Typography>
          </Grid>
          <Grid item>
            <DateTimePicker label="Start" inputRef={startTimeRef} />
          </Grid>
          <Grid item>
            <DateTimePicker label="End" inputRef={endTimeRef} />
          </Grid>
          <Grid item>
            <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write description here..."}
              fullWidth
              inputRef={descriptionRef}
            />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleCreate}
          submitText={"Create"}
        />
      </Box>
    </Modal>
  );
};

export default CreateActivityModal;
