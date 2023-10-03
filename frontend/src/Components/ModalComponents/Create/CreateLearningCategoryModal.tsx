import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import ActionsButtons from "../ActionsButtons";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { createLearningCategory } from "../../../logic/learningCategories";

const CreateLearningCategoryModal = (props: {
  open: boolean;
  handleClose: () => void;
}) => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();

  const handleCreate = async () => {
    if (!titleRef.current) return;
    const title = titleRef.current.value;
    const response = await createLearningCategory(title);
    if (response.status === 201) {
      enqueueSnackbar("Category created!", { variant: "success" });
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
              Create learning category
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={"Name"} fullWidth inputRef={titleRef} />
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

export default CreateLearningCategoryModal;
