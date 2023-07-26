import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRef } from "react";
import { style } from "./modalStyles";
import { createNote } from "../../logic/notes";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { enqueueSnackbar } from "notistack";

const CreateNoteModal = (props: { open: boolean; handleClose: any }) => {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();

  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const status = await createNote(title, description);
    if (status === 201) {
      enqueueSnackbar("Note created!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create note
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          inputRef={titleRef}
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write your note here..."}
          fullWidth
          inputRef={descriptionRef}
        />
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleCreate}>Create</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default CreateNoteModal;
