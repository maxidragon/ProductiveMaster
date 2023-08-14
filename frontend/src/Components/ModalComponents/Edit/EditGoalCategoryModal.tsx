import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { GoalCategory } from "../../../logic/interfaces";
import { updateGoalCategory } from "../../../logic/goalCategories";
import ActionsButtons from "../ActionsButtons";

const EditGoalCategoryModal = (props: { open: boolean; handleClose: any, goalCategory: GoalCategory, updateGoalCategory: any }) => {
  const handleEdit = async (event: any) => {
    event.preventDefault();
    const status = await updateGoalCategory(props.goalCategory);
    if (status === 200) {
      enqueueSnackbar("Category updated!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
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
              onChange={(event) => props.updateGoalCategory({ ...props.goalCategory, title: event.target.value })}
            />
          </Grid>
        </Grid>
        <ActionsButtons cancel={props.handleClose} submit={handleEdit} submitText={"Edit"} />
      </Box>
    </Modal>
  )
};

export default EditGoalCategoryModal;
