import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import ActionsButtons from "../ActionsButtons";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { addProjectParticipant } from "../../../logic/projectParticipants";

const AddProjectParticipantModal = (props: {
  open: boolean;
  handleClose: () => void;
  projectId: number;
}) => {
  const emailRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const handleCreate = async () => {
    if (!emailRef.current) return;
    const email = emailRef.current.value;
    const response = await addProjectParticipant(
      email,
      props.projectId,
      isOwner,
    );
    if (response.status === 201) {
      enqueueSnackbar("User added!", { variant: "success" });
      props.handleClose();
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
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add user to project by email
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={"Email"} fullWidth inputRef={emailRef} />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOwner}
                  onChange={(event) => setIsOwner(event.target.checked)}
                />
              }
              label="Owner"
            />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleCreate}
          submitText={"Create"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default AddProjectParticipantModal;
