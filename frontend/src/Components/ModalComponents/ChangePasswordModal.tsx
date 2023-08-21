import { Modal, Box, TextField, Typography, Grid } from "@mui/material";
import { formStyle, style } from "./modalStyles";
import { useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { changePassword } from "../../logic/auth";
import ActionsButtons from "./ActionsButtons";
import EditIcon from "@mui/icons-material/Edit";

const ChangePasswordModal = (props: {
  open: boolean;
  handleClose: () => void;
}) => {
  const oldPasswordRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  const newPasswordRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  const newPasswordAgainRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  const handleSubmit = async () => {
    if (
      !oldPasswordRef.current ||
      !newPasswordRef.current ||
      !newPasswordAgainRef.current
    )
      return;
    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const newPasswordAgain = newPasswordAgainRef.current.value;
    if (newPassword !== newPasswordAgain) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }
    const status = await changePassword(oldPassword, newPassword);
    if (status === 200) {
      enqueueSnackbar("Password has been changed", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Password change failed", { variant: "error" });
    }
  };
  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={style}>
          <Grid container sx={formStyle}>
            <Grid item>
              <Typography variant="h4">Change password</Typography>
            </Grid>
            <Grid item>
              <TextField
                margin="normal"
                label="Old password"
                autoComplete="password"
                autoFocus
                inputRef={oldPasswordRef}
                type="password"
              />
            </Grid>
            <Grid item>
              <TextField
                margin="normal"
                label="New password"
                autoComplete="new-password"
                autoFocus
                inputRef={newPasswordRef}
                type="password"
              />
            </Grid>
            <Grid item>
              <TextField
                margin="normal"
                label="Repeat password"
                autoComplete="new-password"
                autoFocus
                inputRef={newPasswordAgainRef}
                type="password"
              />
            </Grid>
          </Grid>
          <ActionsButtons
            cancel={props.handleClose}
            submit={handleSubmit}
            submitText={"Change password"}
            submitIcon={<EditIcon />}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
