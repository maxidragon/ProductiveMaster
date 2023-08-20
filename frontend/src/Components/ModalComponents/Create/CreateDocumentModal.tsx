import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import ActionsButtons from "../ActionsButtons";
import { createDocument } from "../../../logic/documents";

const CreateDocumentModal = (props: {
  open: boolean;
  handleClose: () => void;
  projectId: number;
}) => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const urlRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !urlRef.current) return;
    const title = titleRef.current.value;
    const url = urlRef.current.value;
    console.log(title, url, props.projectId);
    const response = await createDocument(props.projectId, title, url);
    if (response.status === 201) {
      enqueueSnackbar("Document created!", { variant: "success" });
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
          cancel={props.handleClose}
          submit={handleCreate}
          submitText={"Create"}
        />
      </Box>
    </Modal>
  );
};

export default CreateDocumentModal;
