import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { style } from "./modalStyles";
import EditIcon from '@mui/icons-material/Edit';
import { enqueueSnackbar } from "notistack";
import { GoalCategory } from "../../logic/interfaces";
import { updateGoalCategory } from "../../logic/goalCategories";

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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Update category
        </Typography>
        <Grid>
          <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
            <TextField
              placeholder={"Name"}
              fullWidth
              value={props.goalCategory.title}
              onChange={(event) => props.updateGoalCategory({ ...props.goalCategory, title: event.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
              <Button variant="contained" endIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
            </Box>
          </Grid>
        </Grid>

      </Box>
    </Modal>
  )
};

export default EditGoalCategoryModal;
