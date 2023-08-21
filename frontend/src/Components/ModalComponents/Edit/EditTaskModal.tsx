import {
  Box,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { updateTask } from "../../../logic/tasks";
import { Task } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";

const EditTaskModal = (props: {
  open: boolean;
  handleClose: () => void;
  task: Task;
  updateTask: (task: Task) => void;
}) => {
  const handleEdit = async () => {
    const response = await updateTask(props.task);
    if (response.status === 201) {
      enqueueSnackbar("Task updated!", { variant: "success" });
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
      if (response.data.issue) {
        response.data.issue.forEach((error: string) => {
          enqueueSnackbar(`Issue: ${error}`, { variant: "error" });
        });
      }
      if (response.data.pull_request) {
        response.data.pull_request.forEach((error: string) => {
          enqueueSnackbar(`Pull request: ${error}`, { variant: "error" });
        });
      }
      if (response.data.high_priority) {
        response.data.high_priority.forEach((error: string) => {
          enqueueSnackbar(`High priority: ${error}`, { variant: "error" });
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
              Edit project
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.task.title}
              onChange={(event) =>
                props.updateTask({ ...props.task, title: event.target.value })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Issue"}
              fullWidth
              value={props.task.issue}
              onChange={(event) =>
                props.updateTask({ ...props.task, issue: event.target.value })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Pull Request"}
              fullWidth
              value={props.task.pull_request}
              onChange={(event) =>
                props.updateTask({
                  ...props.task,
                  pull_request: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write task description here..."}
              fullWidth
              value={props.task.description}
              onChange={(event) =>
                props.updateTask({
                  ...props.task,
                  description: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                label="Status"
                required
                name="status"
                value={props.task.status}
                onChange={(event) =>
                  props.updateTask({
                    ...props.task,
                    status: event.target.value,
                  })
                }
              >
                <MenuItem value={"TODO"}>To do</MenuItem>
                <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                <MenuItem value={"DONE"}>Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.task.high_priority}
                  onChange={(event) =>
                    props.updateTask({
                      ...props.task,
                      high_priority: event.target.checked,
                    })
                  }
                />
              }
              label="High priority"
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

export default EditTaskModal;
