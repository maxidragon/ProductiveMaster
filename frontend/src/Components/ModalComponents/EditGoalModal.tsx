import { Box, Button, Checkbox, FormControlLabel, Grid, Modal, TextField, Typography } from "@mui/material";
import { style } from "./modalStyles";
import EditIcon from '@mui/icons-material/Edit';
import { enqueueSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { updateGoalById } from "../../logic/goals";
import { Goal } from "../../logic/interfaces";

const EditGoalModal = (props: { open: boolean; handleClose: any, goal: Goal, updateGoal: any }) => {
  const handleEdit = async (event: any) => {
    event.preventDefault();
    const status = await updateGoalById(props.goal);
    if (status === 200) {
      enqueueSnackbar("Goal updated!", { variant: "success" });
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
          Update goal
        </Typography>
        <Grid>
          <Grid item xs={12} sm={6} sx={{mb: 2}}>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.goal.title}
              onChange={(event) => props.updateGoal({ ...props.goal, title: event.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{mb: 2}}>
            <TextField
              multiline
              rows={15}
              placeholder={"Write description here..."}
              fullWidth
              value={props.goal.description}
              onChange={(event) => props.updateGoal({ ...props.goal, description: event.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{mb: 2}}>
            <DatePicker
              label="End"
              value={dayjs(props.goal.deadline)}
              onChange={(value) => props.updateGoal({ ...props.goal, deadline: value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{mb: 2}}>
            <FormControlLabel control={<Checkbox checked={props.goal.is_achieved} onChange={(event) => props.updateGoal({ ...props.goal, is_achieved: event.target.checked })} />} label="Is achieved" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
              <Button variant="contained" endIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
            </Box>
          </Grid>
        </Grid>

      </Box>
    </Modal>
  )
};

export default EditGoalModal;
