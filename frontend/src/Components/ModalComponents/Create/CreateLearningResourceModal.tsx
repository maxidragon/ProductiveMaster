import { useRef } from "react";
import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createLearningResource } from "../../../logic/learningResources";
import { ModalProps } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  learningId: number;
}
const CreateLearningResourceModal = ({
  open,
  handleClose,
  learningId,
}: Props): JSX.Element => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const urlRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !urlRef.current) return;
    const title = titleRef.current.value;
    const url = urlRef.current.value;
    const response = await createLearningResource(learningId, title, url);
    if (response.status === 201) {
      enqueueSnackbar("Resource created!", { variant: "success" });
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
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create learning resource
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
          </Grid>
          <Grid item>
            <TextField placeholder={"URL"} fullWidth inputRef={urlRef} />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={handleClose}
          submit={handleCreate}
          submitText={"Create"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default CreateLearningResourceModal;
