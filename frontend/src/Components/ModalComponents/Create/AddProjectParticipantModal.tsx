import { useRef, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { addProjectParticipant } from "../../../logic/projectParticipants";
import { ProjectModalProps } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

const AddProjectParticipantModal = ({
  open,
  handleClose,
  projectId,
}: ProjectModalProps): JSX.Element => {
  const emailRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const handleCreate = async () => {
    if (!emailRef.current) return;
    const email = emailRef.current.value;
    const response = await addProjectParticipant(email, projectId, isOwner);
    if (response.status === 201) {
      enqueueSnackbar("User added!", { variant: "success" });
      handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Title: ${error}`, { variant: "error" });
        });
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add user to project by email
        </Typography>
        <TextField placeholder={"Email"} fullWidth inputRef={emailRef} />
        <FormControlLabel
          control={
            <Checkbox
              checked={isOwner}
              onChange={(event) => setIsOwner(event.target.checked)}
            />
          }
          label="Owner"
        />
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

export default AddProjectParticipantModal;
