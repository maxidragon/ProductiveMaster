import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Activity } from "../../../logic/interfaces";
import { updateActivity } from "../../../logic/activities";
import dayjs from "dayjs";
import ActionsButtons from "../ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";

const EditActivityModal = (props: {
  open: boolean;
  handleClose: () => void;
  activity: Activity;
  updateActivity: (activity: Activity) => void;
}) => {
  const handleEdit = async () => {
    const response = await updateActivity(props.activity);
    if (response.status === 200) {
      enqueueSnackbar("Activity updated!", { variant: "success" });
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
              Edit activity
            </Typography>
          </Grid>
          <Grid item>
            <DateTimePicker
              label="Start"
              value={dayjs(props.activity.start_time)}
              onChange={(value) =>
                props.updateActivity({
                  ...props.activity,
                  start_time: new Date(dayjs(value).toISOString()),
                })
              }
            />
          </Grid>
          <Grid item>
            <DateTimePicker
              label="End"
              value={dayjs(props.activity.end_time)}
              onChange={(value) =>
                props.updateActivity({
                  ...props.activity,
                  end_time: new Date(dayjs(value).toISOString()),
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.activity.title}
              onChange={(event) =>
                props.updateActivity({
                  ...props.activity,
                  title: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write description here..."}
              fullWidth
              value={props.activity.description}
              onChange={(event) =>
                props.updateActivity({
                  ...props.activity,
                  description: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleEdit}
          submitText={"Edit"}
          submitIcon={<EditIcon />}
        />
      </Box>
    </Modal>
  );
};

export default EditActivityModal;
