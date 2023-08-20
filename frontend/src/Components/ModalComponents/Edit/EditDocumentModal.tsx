import { Box, Typography, Modal, TextField, Grid } from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { Document as DocumentInterface } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";
import { updateDocument } from "../../../logic/documents";

const EditDocumentModal = (props: {
  open: boolean;
  handleClose: () => void;
  document: DocumentInterface;
  updateDocument: (document: DocumentInterface) => void;
}) => {
  const handleEdit = async () => {
    const status = await updateDocument(props.document);
    if (status === 200) {
      enqueueSnackbar("Document updated!", { variant: "success" });
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
              Edit document
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.document.title}
              onChange={(event) =>
                props.updateDocument({
                  ...props.document,
                  title: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"URL"}
              fullWidth
              value={props.document.url}
              onChange={(event) =>
                props.updateDocument({
                  ...props.document,
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
        />
      </Box>
    </Modal>
  );
};

export default EditDocumentModal;
