import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createGoalCategory } from "../../../logic/goalCategories";
import ActionsButtons from "../ActionsButtons";

const CreateGoalCategoryModal = (props: {
  open: boolean;
  handleClose: () => void;
}) => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();

  const handleCreate = async () => {
    if (!titleRef.current) return;
    const title = titleRef.current.value;
    const status = await createGoalCategory(title);
    if (status === 201) {
      enqueueSnackbar("Category created!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create goal category
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
        />
      </Box>
    </Modal>
  );
};

export default CreateGoalCategoryModal;
