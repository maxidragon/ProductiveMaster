import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { LearningCategory } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getAllLearningCategories } from "../../../logic/learningCategories";
import { createLearning } from "../../../logic/learning";

const CreateLearningModal = (props: {
  open: boolean;
  handleClose: () => void;
}) => {
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
      props.handleClose();
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
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create learning
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={"Name"} fullWidth inputRef={titleRef} />
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
          submit={handleCreate}
          submitText={"Create"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default CreateLearningModal;
