import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { style } from "../modalStyles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { enqueueSnackbar } from "notistack";
import { createGoal } from "../../../logic/goals";
import { DatePicker } from "@mui/x-date-pickers";
import { GoalCategory } from "../../../logic/interfaces";
import { getGoalCategories } from "../../../logic/goalCategories";

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
      const categories = await getGoalCategories();
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
