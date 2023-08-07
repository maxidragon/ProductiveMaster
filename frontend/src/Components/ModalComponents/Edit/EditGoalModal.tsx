import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { actionsButtons, formStyle, style } from "../modalStyles";
import EditIcon from '@mui/icons-material/Edit';
import { enqueueSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { updateGoalById } from "../../../logic/goals";
import { Goal, GoalCategory } from "../../../logic/interfaces";
import { useState, useEffect } from "react";
import { getAllGoalCategories } from "../../../logic/goalCategories";

const EditGoalModal = (props: { open: boolean; handleClose: any, goal: Goal, updateGoal: any }) => {
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
  const [selected, setSelected] = useState<number>(props.goal.goal_category || 0);


  const handleEdit = async (event: any) => {
    event.preventDefault();
    props.updateGoal({ ...props.goal, goal_category: selected });
    if (selected === 0) {
      props.updateGoal({ ...props.goal, goal_category: null });
    }
    const data = props.goal;
    const status = await updateGoalById(data);
    if (status === 200) {
      enqueueSnackbar("Goal updated!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAllGoalCategories();
      setGoalCategories(categories);
    };
    fetchData();
  }, []);
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <Box sx={style}>

        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Update goal
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.goal.title}
              onChange={(event) => props.updateGoal({ ...props.goal, title: event.target.value })}
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write description here..."}
              fullWidth
              value={props.goal.description}
              onChange={(event) => props.updateGoal({ ...props.goal, description: event.target.value })}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="goal-category-select-label">
                Goal Category
              </InputLabel>
              <Select
                labelId="goal-category-select-label"
                id="goal-category-select"
                value={selected}
                label="Goal Category"
                onChange={(event: any) => {
                  setSelected(event.target.value);
                }}
              >
                <MenuItem key={0} value={0}>
                  Without category
                </MenuItem>
                {goalCategories.map((goalCategory: GoalCategory) => (
                  <MenuItem key={goalCategory.id} value={goalCategory.id}>
                    {goalCategory.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <DatePicker
              label="End"
              value={dayjs(props.goal.deadline)}
              onChange={(value) => props.updateGoal({ ...props.goal, deadline: value })}
            />
          </Grid>
          <Grid item>
            <FormControlLabel control={<Checkbox checked={props.goal.is_achieved} onChange={(event) => props.updateGoal({ ...props.goal, is_achieved: event.target.checked })} />} label="Is achieved" />
          </Grid>
        </Grid>
        <Box sx={actionsButtons}>
          <Button variant="contained" endIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default EditGoalModal;
