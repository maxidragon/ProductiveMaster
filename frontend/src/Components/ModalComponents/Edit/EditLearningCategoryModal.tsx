import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { LearningCategory } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";
import { updateLearningCategory } from "../../../logic/learningCategories";

const EditLearningCategoryModal = (props: {
  open: boolean;
  handleClose: () => void;
  learningCategory: LearningCategory;
  updateLearningCategory: (learningCategory: LearningCategory) => void;
}) => {
  const handleEdit = async () => {
    const response = await updateLearningCategory(props.learningCategory);
    if (response.status === 200) {
      enqueueSnackbar("Category updated!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Name: ${error}`, { variant: "error" });
        });
      }
    }
  };
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Update category
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Name"}
              fullWidth
              value={props.learningCategory.name}
              onChange={(event) =>
                props.updateLearningCategory({
                  ...props.learningCategory,
                  name: event.target.value,
                })
              }
            />
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

export default EditLearningCategoryModal;
