import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import { style } from "./modalStyles";
import EditIcon from '@mui/icons-material/Edit';
import { enqueueSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Activity } from "../../logic/interfaces";
import { updateActivity } from "../../logic/activities";
import dayjs from "dayjs";

const EditActivityModal = (props: { open: boolean; handleClose: any, activity: Activity, updateActivity: any }) => {

  const handleEdit = async (event: any) => {
    event.preventDefault();
    const status = await updateActivity(props.activity);
    if (status === 200) {
      enqueueSnackbar("Activity updated!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Update activity
        </Typography>
        <DateTimePicker
          label="Start"
          value={dayjs(props.activity.start_time)}
          onChange={(value) => props.updateActivity({ ...props.activity, start_time: value })}
        />
        <DateTimePicker
          label="End"
          value={dayjs(props.activity.end_time)}
          onChange={(value) => props.updateActivity({ ...props.activity, end_time: value })}
        />
        <TextField
          placeholder={"Title"}
          fullWidth
          value={props.activity.title}
          onChange={(event) => props.updateActivity({ ...props.activity, title: event.target.value })}
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
          fullWidth
          value={props.activity.description}
          onChange={(event) => props.updateActivity({ ...props.activity, description: event.target.value })}
        />
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" endIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default EditActivityModal;
