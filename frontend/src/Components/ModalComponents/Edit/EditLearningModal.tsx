import {
  Box,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import {
  LearningCategory,
  LearningType,
  ModalProps,
} from "../../../logic/interfaces";
import { editLearning } from "../../../logic/learning";
import { useEffect, useState } from "react";
import { getAllLearningCategories } from "../../../logic/learningCategories";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  learning: LearningType;
  updateLearning: (learning: LearningType) => void;
}

const EditLearningModal = ({
  open,
  handleClose,
  learning,
  updateLearning,
}: Props): JSX.Element => {
  const [learningCategories, setLearningCategories] = useState<
    LearningCategory[]
  >([]);
  const [selected, setSelected] = useState<number>(
    learning.learning_category.id,
  );
  const handleEdit = async () => {
    const response = await editLearning(learning);
    if (response.status === 200) {
      enqueueSnackbar("Task updated!", { variant: "success" });
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
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit task
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={learning.title}
          onChange={(event) =>
            updateLearning({
              ...learning,
              title: event.target.value,
            })
          }
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
          fullWidth
          value={learning.description}
          onChange={(event) =>
            updateLearning({
              ...learning,
              description: event.target.value,
            })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="status">Status</InputLabel>
          <Select
            labelId="status"
            label="Status"
            required
            name="status"
            value={learning.status}
            onChange={(event) =>
              updateLearning({
                ...learning,
                status: event.target.value,
              })
            }
          >
            <MenuItem value={"TO_LEARN"}>To learn</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>
          </Select>
        </FormControl>
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
            {learningCategories.map((learningCategory: LearningCategory) => (
              <MenuItem key={learningCategory.id} value={learningCategory.id}>
                {learningCategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default EditLearningModal;
