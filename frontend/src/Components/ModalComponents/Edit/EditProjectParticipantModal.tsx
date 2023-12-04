import {
  Box,
  Typography,
  Modal,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { ModalProps, ProjectParticipant } from "../../../logic/interfaces";
import { updateProjectParticipant } from "../../../logic/projectParticipants";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  user: ProjectParticipant;
  updateUser: (user: ProjectParticipant) => void;
}

const EditProjectParticipantModal = ({
  open,
  handleClose,
  user,
  updateUser,
}: Props): JSX.Element => {
  const handleEdit = async () => {
    const data = {
      id: user.id,
      is_owner: user.is_owner,
      user: user.user.id,
      added_by: user.added_by.id,
      project: user.project,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    const response = await updateProjectParticipant(data);
    if (response.status === 200) {
      enqueueSnackbar("User updated!", { variant: "success" });
      handleClose();
    } else if (response.status === 400) {
      enqueueSnackbar("User not deleted!", { variant: "info" });
      enqueueSnackbar(response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit user
            </Typography>
          </Grid>
          <Grid item>
            {user.user.username} added by {user.added_by.username}
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={user.is_owner}
                  onChange={(event) =>
                    updateUser({
                      ...user,
                      is_owner: event.target.checked,
                    })
                  }
                />
              }
              label="Owner"
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

export default EditProjectParticipantModal;
