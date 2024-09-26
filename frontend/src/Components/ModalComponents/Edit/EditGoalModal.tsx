import { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { updateGoalById } from "../../../logic/goals";
import { EditGoal, GoalCategory, ModalProps } from "../../../logic/interfaces";
import { getAllGoalCategories } from "../../../logic/goalCategories";
import dayjs from "dayjs";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  goal: EditGoal;
  updateGoal: (goal: EditGoal) => void;
}
const EditGoalModal = ({
  open,
  handleClose,
  goal,
  updateGoal,
}: Props): JSX.Element => {
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
  const [selected, setSelected] = useState<number>(
    goal.goal_category ? goal.goal_category : 0,
  );

  const handleEdit = async () => {
    updateGoal({ ...goal, goal_category: selected });
    if (selected === 0) {
      updateGoal(goal);
    }
    const data = goal;
    const response = await updateGoalById(data);
    if (response.status === 200) {
      enqueueSnackbar("Goal updated!", { variant: "success" });
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
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Update goal
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={goal.title}
          onChange={(event) =>
            updateGoal({ ...goal, title: event.target.value })
          }
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
          fullWidth
          value={goal.description}
          onChange={(event) =>
            updateGoal({
              ...goal,
              description: event.target.value,
            })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="goal-category-select-label">Goal Category</InputLabel>
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
        <DatePicker
          label="End"
          value={dayjs(goal.deadline)}
          onChange={(value) => {
            if (!value) return;
            const formattedDate = new Date(value.toISOString());
            updateGoal({ ...goal, deadline: formattedDate });
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={goal.is_achieved}
              onChange={(event) =>
                updateGoal({
                  ...goal,
                  is_achieved: event.target.checked,
                })
              }
            />
          }
          label="Is achieved"
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

export default EditGoalModal;
