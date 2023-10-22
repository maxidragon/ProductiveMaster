import {
  Box,
  Typography,
  Modal,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { ProjectParticipant } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";
import { updateProjectParticipant } from "../../../logic/projectParticipants";

const EditProjectParticipantModal = (props: {
  open: boolean;
  handleClose: () => void;
  user: ProjectParticipant;
  updateUser: (user: ProjectParticipant) => void;
}) => {
  const handleEdit = async () => {
    const data = {
      id: props.user.id,
      is_owner: props.user.is_owner,
      user: props.user.user.id,
      added_by: props.user.added_by.id,
      project: props.user.project,
      created_at: props.user.created_at,
      updated_at: props.user.updated_at,
    };
    const response = await updateProjectParticipant(data);
    if (response.status === 200) {
      enqueueSnackbar("User updated!", { variant: "success" });
      props.handleClose();
    } else if (response.status === 400) {
      enqueueSnackbar("User not deleted!", { variant: "info" });
      enqueueSnackbar(response.data.message, { variant: "error" });
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
              Edit user
            </Typography>
          </Grid>
          <Grid item>
            {props.user.user.username} added by {props.user.added_by.username}
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.user.is_owner}
                  onChange={(event) =>
                    props.updateUser({
                      ...props.user,
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
          cancel={props.handleClose}
          submit={handleEdit}
          submitText={"Edit"}
          submitIcon={<EditIcon />}
        />
      </Box>
    </Modal>
  );
};

export default EditProjectParticipantModal;
