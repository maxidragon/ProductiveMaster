import { Box, Modal, TextField, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Activity, ModalProps } from "../../../logic/interfaces";
import { updateActivity } from "../../../logic/activities";
import dayjs from "dayjs";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  activity: Activity;
  editActivity: (activity: Activity) => void;
}

const EditActivityModal = ({
  open,
  handleClose,
  activity,
  editActivity,
}: Props): JSX.Element => {
  const handleEdit = async () => {
    const response = await updateActivity(activity);
    if (response.status === 200) {
      enqueueSnackbar("Activity updated!", { variant: "success" });
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
          Edit activity
        </Typography>
        <DateTimePicker
          label="Start"
          value={dayjs(activity.start_time)}
          onChange={(value) =>
            editActivity({
              ...activity,
              start_time: new Date(dayjs(value).toISOString()),
            })
          }
        />
        <DateTimePicker
          label="End"
          value={dayjs(activity.end_time)}
          onChange={(value) =>
            editActivity({
              ...activity,
              end_time: new Date(dayjs(value).toISOString()),
            })
          }
        />
        <TextField
          placeholder={"Title"}
          fullWidth
          value={activity.title}
          onChange={(event) =>
            editActivity({
              ...activity,
              title: event.target.value,
            })
          }
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
          fullWidth
          value={activity.description}
          onChange={(event) =>
            editActivity({
              ...activity,
              description: event.target.value,
            })
          }
        />
        <ActionsButtons
          cancel={handleClose}
          submit={handleEdit}
          submitText={"Edit"}
          submitIcon={<EditIcon />}
        />
      </Box>
    </Modal>
  );
};

export default EditActivityModal;
