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
  SelectChangeEvent,
} from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { LearningCategory, LearningType } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";
import { editLearning } from "../../../logic/learning";
import { useEffect, useState } from "react";
import { getAllLearningCategories } from "../../../logic/learningCategories";

const EditLearningModal = (props: {
  open: boolean;
  handleClose: () => void;
  learning: LearningType;
  updateLearning: (learning: LearningType) => void;
}) => {
  const [learningCategories, setLearningCategories] = useState<
    LearningCategory[]
  >([]);
  const [selected, setSelected] = useState<number>(
    props.learning.learning_category.id,
  );
  const handleEdit = async () => {
    const response = await editLearning(props.learning);
    if (response.status === 200) {
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
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAllLearningCategories();
      setLearningCategories(categories);
    };
    fetchData();
  }, []);

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit task
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.learning.title}
              onChange={(event) =>
                props.updateLearning({
                  ...props.learning,
                  title: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write description here..."}
              fullWidth
              value={props.learning.description}
              onChange={(event) =>
                props.updateLearning({
                  ...props.learning,
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
                value={props.learning.status}
                onChange={(event) =>
                  props.updateLearning({
                    ...props.learning,
                    status: event.target.value,
                  })
                }
              >
                <MenuItem value={"TO_LEARAN"}>To learn</MenuItem>
                <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                <MenuItem value={"DONE"}>Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="goal-category-select-label">
                Learning Category
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
                {learningCategories.map(
                  (learningCategory: LearningCategory) => (
                    <MenuItem
                      key={learningCategory.id}
                      value={learningCategory.id}
                    >
                      {learningCategory.name}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
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

export default EditLearningModal;
