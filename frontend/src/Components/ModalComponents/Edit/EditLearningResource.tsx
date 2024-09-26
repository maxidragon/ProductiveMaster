import { Box, Typography, Modal, TextField } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { updateLearningResource } from "../../../logic/learningResources";
import { LearningResource, ModalProps } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  resource: LearningResource;
  updateResource: (resource: LearningResource) => void;
}

const EditLearningResourceModal = ({
  open,
  handleClose,
  resource,
  updateResource,
}: Props): JSX.Element => {
  const handleEdit = async () => {
    const response = await updateLearningResource(resource);
    if (response.status === 200) {
      enqueueSnackbar("Resource updated!", { variant: "success" });
      handleClose();
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
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit resource
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={resource.title}
          onChange={(event) =>
            updateResource({
              ...resource,
              title: event.target.value,
            })
          }
        />
        <TextField
          placeholder={"URL"}
          fullWidth
          value={resource.url}
          onChange={(event) =>
            updateResource({
              ...resource,
              url: event.target.value,
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

export default EditLearningResourceModal;
