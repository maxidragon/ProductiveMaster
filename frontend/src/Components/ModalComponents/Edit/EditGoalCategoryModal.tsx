import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { GoalCategory } from "../../../logic/interfaces";
import { updateGoalCategory } from "../../../logic/goalCategories";
import ActionsButtons from "../ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";

const EditGoalCategoryModal = (props: {
  open: boolean;
  handleClose: () => void;
  goalCategory: GoalCategory;
  updateGoalCategory: (goalCategory: GoalCategory) => void;
}) => {
  const handleEdit = async () => {
    const response = await updateGoalCategory(props.goalCategory);
    if (response.status === 200) {
      enqueueSnackbar("Category updated!", { variant: "success" });
      props.handleClose();
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
              value={props.goalCategory.title}
              onChange={(event) =>
                props.updateGoalCategory({
                  ...props.goalCategory,
                  title: event.target.value,
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

export default EditGoalCategoryModal;
