import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import { useRef } from "react";
import { style } from "./modalStyles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { enqueueSnackbar } from "notistack";
import { createGoal } from "../../logic/goals";
import { DatePicker } from "@mui/x-date-pickers";

const CreateGoalModal = (props: { open: boolean; handleClose: any }) => {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();
  const deadlineRef: any = useRef();

  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const deadline = deadlineRef.current.value;

    const status = await createGoal(title, description, deadline);
    if (status === 201) {
      enqueueSnackbar("Goal created!", { variant: "success" });
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create goal
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          inputRef={titleRef}
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
          fullWidth
          inputRef={descriptionRef}
        />
        <DatePicker
          label="End"
          inputRef={deadlineRef}
        />
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleCreate}>Create</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default CreateGoalModal;
