import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { actionsButtons, formStyle, style } from "../modalStyles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { enqueueSnackbar } from "notistack";
import { createGoalCategory } from "../../../logic/goalCategories";

const CreateGoalCategoryModal = (props: { open: boolean; handleClose: any }) => {
  const titleRef: any = useRef();

  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const status = await createGoalCategory(title);
    if (status === 201) {
      enqueueSnackbar("Category created!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create goal category
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Name"}
              fullWidth
              inputRef={titleRef}
            />
          </Grid>
        </Grid>
        <Box sx={actionsButtons}>
          <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleCreate}>Create</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default CreateGoalCategoryModal;
