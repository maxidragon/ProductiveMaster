import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createGoal } from "../../../logic/goals";
import { DatePicker } from "@mui/x-date-pickers";
import { GoalCategory } from "../../../logic/interfaces";
import { getAllGoalCategories } from "../../../logic/goalCategories";
import ActionsButtons from "../ActionsButtons";

const CreateGoalModal = (props: { open: boolean; handleClose: any }) => {
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();
  const deadlineRef: any = useRef();

  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const deadline = deadlineRef.current.value;
    const data: any = {
      title: title,
      description: description,
      deadline: deadline,
    };
    if (selected !== 0) {
      data["goal_category"] = selected;
    }
    const status = await createGoal(data);
    if (status === 201) {
      enqueueSnackbar("Goal created!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }

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
              Create goal
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              inputRef={titleRef}
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write description here..."}
              fullWidth
              inputRef={descriptionRef}
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
              inputRef={deadlineRef}
            />
          </Grid>
        </Grid>
        <ActionsButtons cancel={props.handleClose} submit={handleCreate} submitText={"Create"} />
      </Box>
    </Modal>
  )
};

export default CreateGoalModal;
