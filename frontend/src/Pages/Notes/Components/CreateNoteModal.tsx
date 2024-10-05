import { useRef } from "react";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { style } from "../../../Components/ModalComponents/modalStyles";
import { createNote } from "../../../logic/notes";
import { enqueueSnackbar } from "notistack";
import { ModalProps } from "../../../logic/interfaces";
import ActionsButtons from "../../../Components/ModalComponents/ActionsButtons";
import { useNavigate } from "react-router-dom";

const CreateNoteModal = ({ open, handleClose }: ModalProps): JSX.Element => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!titleRef.current) return;
    const title = titleRef.current.value;
    const description = "";
    const response = await createNote(title, description);
    if (response.status === 201) {
      enqueueSnackbar("Note created!", { variant: "success" });
      navigate(`/note/${response.data.id}`);
      handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Title: ${error}`, { variant: "error" });
        });
      }
      if (response.data.description) {
        response.data.description.forEach((error: string) => {
          enqueueSnackbar(`Description: ${error}`, { variant: "error" });
        });
      }
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create note
        </Typography>
        <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
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

export default CreateNoteModal;
