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
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { LearningCategory, ModalProps } from "../../../logic/interfaces";
import { getAllLearningCategories } from "../../../logic/learningCategories";
import { createLearning } from "../../../logic/learning";
import ActionsButtons from "../ActionsButtons";

const CreateLearningModal = ({
  open,
  handleClose,
}: ModalProps): JSX.Element => {
  const [learningCategories, setLearningCategories] = useState<
    LearningCategory[]
  >([]);
  const [selected, setSelected] = useState<number>(0);
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const descriptionRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !descriptionRef.current) return;
    const name = titleRef.current.value;
    const description = descriptionRef.current.value;
    const response = await createLearning(name, description, selected);
    if (response.status === 201) {
      enqueueSnackbar("Goal created!", { variant: "success" });
      handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.name) {
        response.data.name.forEach((error: string) => {
          enqueueSnackbar(`Name: ${error}`, { variant: "error" });
        });
      }
      if (response.data.description) {
        response.data.description.forEach((error: string) => {
          enqueueSnackbar(`Description: ${error}`, { variant: "error" });
        });
      }
      if (response.data.learning_category) {
        response.data.learning_category.forEach((error: string) => {
          enqueueSnackbar(`Learning category: ${error}`, { variant: "error" });
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
          Create learning
        </Typography>
        <TextField placeholder={"Name"} fullWidth inputRef={titleRef} />
        <TextField
          multiline
          rows={15}
          placeholder={"Write description here..."}
          fullWidth
          inputRef={descriptionRef}
        />
        <FormControl fullWidth>
          <InputLabel id="goal-category-select-label">
            Learning Category
          </InputLabel>
          <Select
            labelId="goal-category-select-label"
            id="goal-category-select"
            value={selected}
            label="Learning Category"
            onChange={(event: SelectChangeEvent<number>) => {
              setSelected(event.target.value as number);
            }}
          >
            {learningCategories.map((learningCategory: LearningCategory) => (
              <MenuItem key={learningCategory.id} value={learningCategory.id}>
                {learningCategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default CreateLearningModal;
