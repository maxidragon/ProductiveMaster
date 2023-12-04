import { useRef } from "react";
import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createDocument } from "../../../logic/documents";
import { ProjectModalProps } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

const CreateDocumentModal = ({
  open,
  handleClose,
  projectId,
}: ProjectModalProps): JSX.Element => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const urlRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !urlRef.current) return;
    const title = titleRef.current.value;
    const url = urlRef.current.value;
    const response = await createDocument(projectId, title, url);
    if (response.status === 201) {
      enqueueSnackbar("Document created!", { variant: "success" });
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
              Create document
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

export default CreateDocumentModal;
