import {
  Box,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { formStyle, style } from '../modalStyles';
import { enqueueSnackbar } from 'notistack';
import { updateTask } from '../../../logic/tasks';
import { Task } from '../../../logic/interfaces';
import ActionsButtons from '../ActionsButtons';

const EditTaskModal = (props: {
  open: boolean;
  handleClose: any;
  task: Task;
  updateTask: any;
}) => {
  const handleEdit = async (event: any) => {
    event.preventDefault();
    const status = await updateTask(props.task);
    if (status === 200) {
      enqueueSnackbar('Task updated!', { variant: 'success' });
      props.handleClose();
    } else {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
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
              placeholder={'Title'}
              fullWidth
              value={props.task.title}
              onChange={(event) =>
                props.updateTask({ ...props.task, title: event.target.value })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={'Issue'}
              fullWidth
              value={props.task.issue}
              onChange={(event) =>
                props.updateTask({ ...props.task, issue: event.target.value })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={'Pull Request'}
              fullWidth
              value={props.task.pull_request}
              onChange={(event) =>
                props.updateTask({ ...props.task, pull_request: event.target.value })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={'Write task description here...'}
              fullWidth
              value={props.task.description}
              onChange={(event) =>
                props.updateTask({ ...props.task, description: event.target.value })
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
                  props.updateTask({ ...props.task, status: event.target.value })
                }
              >
                <MenuItem value={'TODO'}>To do</MenuItem>
                <MenuItem value={'IN_PROGRESS'}>In progress</MenuItem>
                <MenuItem value={'DONE'}>Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleEdit}
          submitText={'Edit'}
        />
      </Box>
    </Modal>
  );
};

export default EditTaskModal;
