import { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createGoal } from "../../../logic/goals";
import {
  CreateGoal,
  GoalCategory,
  ModalProps,
} from "../../../logic/interfaces";
import { getAllGoalCategories } from "../../../logic/goalCategories";
import ActionsButtons from "../ActionsButtons";

const CreateGoalModal = ({ open, handleClose }: ModalProps): JSX.Element => {
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const descriptionRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  //eslint-disable-next-line
  const deadlineRef: any = useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !descriptionRef.current || !deadlineRef.current)
      return;
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const deadline = deadlineRef.current.value;
    const data: CreateGoal = {
      title: title,
      description: description,
      deadline_string: deadline,
    };
    if (selected !== 0) {
      data["goal_category"] = selected;
    }
    const response = await createGoal(data);
    if (response.status === 201) {
      enqueueSnackbar("Goal created!", { variant: "success" });
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
          Create goal
        </Typography>
        <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
          fullWidth
          inputRef={descriptionRef}
        />
        <FormControl fullWidth>
          <InputLabel id="goal-category-select-label">Goal Category</InputLabel>
          <Select
            labelId="goal-category-select-label"
            id="goal-category-select"
            value={selected}
            label="Goal Category"
            onChange={(event: SelectChangeEvent<number>) => {
              setSelected(event.target.value as number);
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
        <DatePicker label="Deadline" inputRef={deadlineRef} />
        <ActionsButtons
          cancel={handleClose}
          submit={handleCreate}
          submitText={"Create"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default CreateGoalModal;
