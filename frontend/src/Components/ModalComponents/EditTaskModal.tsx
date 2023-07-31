import { Box, Typography, Modal, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { style } from "./modalStyles";
import { enqueueSnackbar } from "notistack";
import EditIcon from '@mui/icons-material/Edit';
import { updateTask } from "../../logic/tasks";
import { Task } from "../../logic/interfaces";

const EditTaskModal = (props: { open: boolean; handleClose: any, task: Task, updateTask: any }) => {
  const handleEdit = async (event: any) => {
    event.preventDefault();
    const status = await updateTask(props.task);
    if (status === 200) {
      enqueueSnackbar("Project updated!", { variant: "success" });
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
          Edit project
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={props.task.title}
          onChange={(event) => props.updateTask({ ...props.task, title: event.target.value })}
        />
        <TextField
          placeholder={"Issue"}
          fullWidth
          value={props.task.issue}
          onChange={(event) => props.updateTask({ ...props.task, issue: event.target.value })}
        />
        <TextField
          placeholder={"Pull Request"}
          fullWidth
          value={props.task.pull_request}
          onChange={(event) => props.updateTask({ ...props.task, pull_request: event.target.value })}
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write task description here..."}
          fullWidth
          value={props.task.description}
          onChange={(event) => props.updateTask({ ...props.task, description: event.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel id="status">Status</InputLabel>
          <Select
            labelId="status"
            label="Status"
            required
            name="status"
            value={props.task.status}
            onChange={(event) => props.updateTask({ ...props.task, status: event.target.value })}
          >
            <MenuItem value={"TODO"}>To do</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>  
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" endIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default EditTaskModal;
