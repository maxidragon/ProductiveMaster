import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { actionsButtons, formStyle, style } from "../modalStyles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { enqueueSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers";
import { createActivity } from "../../../logic/activities";

const CreateActivityModal = (props: { open: boolean; handleClose: any }) => {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();
  const startTimeRef: any = useRef();
  const endTimeRef: any = useRef();
  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const status = await createActivity(title, description, startTimeRef.current.value, endTimeRef.current.value);
    if (status === 201) {
      enqueueSnackbar("Activity created!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create activity
            </Typography>
          </Grid>
          <Grid item>
            <DateTimePicker
              label="Start"
              inputRef={startTimeRef}
            />
          </Grid>
          <Grid item>
            <DateTimePicker
              label="End"
              inputRef={endTimeRef}
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              inputRef={titleRef}
            />
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
        <Box sx={actionsButtons}>
          <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleCreate}>Create</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default CreateActivityModal;