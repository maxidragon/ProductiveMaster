import { Box, Modal, TextField, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { GoalCategory, ModalProps } from "../../../logic/interfaces";
import { updateGoalCategory } from "../../../logic/goalCategories";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  goalCategory: GoalCategory;
  editGoalCategory: (goalCategory: GoalCategory) => void;
}

const EditGoalCategoryModal = ({
  open,
  handleClose,
  goalCategory,
  editGoalCategory,
}: Props): JSX.Element => {
  const handleEdit = async () => {
    const response = await updateGoalCategory(goalCategory);
    if (response.status === 200) {
      enqueueSnackbar("Category updated!", { variant: "success" });
      handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Title: ${error}`, { variant: "error" });
        });
      }
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Update category
        </Typography>
        <TextField
          placeholder={"Name"}
          fullWidth
          value={goalCategory.title}
          onChange={(event) =>
            editGoalCategory({
              ...goalCategory,
              title: event.target.value,
            })
          }
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

export default EditGoalCategoryModal;
