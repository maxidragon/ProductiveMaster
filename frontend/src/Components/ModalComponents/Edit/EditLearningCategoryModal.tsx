import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { LearningCategory, ModalProps } from "../../../logic/interfaces";
import { updateLearningCategory } from "../../../logic/learningCategories";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  learningCategory: LearningCategory;
  editLearningCategory: (learningCategory: LearningCategory) => void;
}

const EditLearningCategoryModal = ({
  open,
  handleClose,
  learningCategory,
  editLearningCategory,
}: Props): JSX.Element => {
  const handleEdit = async () => {
    const response = await updateLearningCategory(learningCategory);
    if (response.status === 200) {
      enqueueSnackbar("Category updated!", { variant: "success" });
      handleClose();
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
    <Modal open={open} onClose={handleClose}>
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
              value={learningCategory.name}
              onChange={(event) =>
                editLearningCategory({
                  ...learningCategory,
                  name: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
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

export default EditLearningCategoryModal;
