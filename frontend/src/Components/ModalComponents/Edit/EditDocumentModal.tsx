import { Box, Typography, Modal, TextField, Grid } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import {
  Document as DocumentInterface,
  ModalProps,
} from "../../../logic/interfaces";
import { updateDocument } from "../../../logic/documents";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  document: DocumentInterface;
  editDocument: (document: DocumentInterface) => void;
}

const EditDocumentModal = ({
  open,
  handleClose,
  document,
  editDocument,
}: Props): JSX.Element => {
  const handleEdit = async () => {
    const response = await updateDocument(document);
    if (response.status === 200) {
      enqueueSnackbar("Document updated!", { variant: "success" });
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
              Edit document
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={document.title}
              onChange={(event) =>
                editDocument({
                  ...document,
                  title: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"URL"}
              fullWidth
              value={document.url}
              onChange={(event) =>
                editDocument({
                  ...document,
                  url: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
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

export default EditDocumentModal;
