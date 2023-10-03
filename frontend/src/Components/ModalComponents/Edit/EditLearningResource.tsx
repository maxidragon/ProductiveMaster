import { Box, Typography, Modal, TextField, Grid } from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import ActionsButtons from "../ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";
import { updateLearningResource } from "../../../logic/learningResources";
import { LearningResource } from "../../../logic/interfaces";

const EditLearningResourceModal = (props: {
  open: boolean;
  handleClose: () => void;
  resource: LearningResource;
  updateResource: (resource: LearningResource) => void;
}) => {
  const handleEdit = async () => {
    const response = await updateLearningResource(props.resource);
    if (response.status === 200) {
      enqueueSnackbar("Resource updated!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Title: ${error}`, { variant: "error" });
        });
      }
      if (response.data.url) {
        response.data.url.forEach((error: string) => {
          enqueueSnackbar(`URL: ${error}`, { variant: "error" });
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
              Edit resource
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.resource.title}
              onChange={(event) =>
                props.updateResource({
                  ...props.resource,
                  title: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"URL"}
              fullWidth
              value={props.resource.url}
              onChange={(event) =>
                props.updateResource({
                  ...props.resource,
                  url: event.target.value,
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

export default EditLearningResourceModal;
