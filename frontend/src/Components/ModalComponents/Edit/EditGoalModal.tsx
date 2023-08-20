import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { updateGoalById } from "../../../logic/goals";
import { EditGoal, GoalCategory } from "../../../logic/interfaces";
import { useState, useEffect } from "react";
import { getAllGoalCategories } from "../../../logic/goalCategories";
import ActionsButtons from "../ActionsButtons";

const EditGoalModal = (props: {
  open: boolean;
  handleClose: () => void;
  goal: EditGoal;
  updateGoal: (goal: EditGoal) => void;
}) => {
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
  const [selected, setSelected] = useState<number>(
    props.goal.goal_category ? props.goal.goal_category : 0,
  );

  const handleEdit = async () => {
    props.updateGoal({ ...props.goal, goal_category: selected });
    if (selected === 0) {
      props.updateGoal(props.goal);
    }
    const data = props.goal;
    const response = await updateGoalById(data);
    if (response.status === 200) {
      enqueueSnackbar("Goal updated!", { variant: "success" });
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
      if (response.data.goal_category) {
        response.data.goal_category.forEach((error: string) => {
          enqueueSnackbar(`Goal category: ${error}`, { variant: "error" });
        });
      }
      if (response.data.deadline) {
        response.data.deadline.forEach((error: string) => {
          enqueueSnackbar(`Deadline: ${error}`, { variant: "error" });
        });
      }
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
    <Modal open={props.open} onClose={props.handleClose}>
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
              onChange={(event) =>
                props.updateGoal({ ...props.goal, title: event.target.value })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write description here..."}
              fullWidth
              value={props.goal.description}
              onChange={(event) =>
                props.updateGoal({
                  ...props.goal,
                  description: event.target.value,
                })
              }
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
                onChange={(event: SelectChangeEvent<number>) => {
                  setSelected(+event.target.value);
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
              onChange={(value) => {
                if (!value) return;
                const formattedDate = new Date(value.toISOString());
                props.updateGoal({ ...props.goal, deadline: formattedDate });
              }}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.goal.is_achieved}
                  onChange={(event) =>
                    props.updateGoal({
                      ...props.goal,
                      is_achieved: event.target.checked,
                    })
                  }
                />
              }
              label="Is achieved"
            />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleEdit}
          submitText={"Edit"}
        />
      </Box>
    </Modal>
  );
};

export default EditGoalModal;
