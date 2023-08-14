import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, TextField } from "@mui/material";
import ChangePasswordModal from "../../Components/ModalComponents/ChangePasswordModal";
import { getUser, updateSettings } from "../../logic/auth";
import { enqueueSnackbar } from "notistack";
import EditUserDataModal from "../../Components/ModalComponents/Edit/EditUserDataModal";

const Settings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [openChangePasswordModal, setOpenChangePasswordModal] =
    useState<boolean>(false);
  const [openDataModal, setOpenDataModal] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      email: event.target.value,
    });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      username: event.target.value,
    });
  };

  const handleSubmit = async () => {
    const response = await updateSettings(settings);
    const data = await response.json();
    if (response.status === 200) {
      enqueueSnackbar("Settings has been updated", { variant: "success" });
    } else if (response.status === 400) {
      if (data.email) {
        data.email.forEach((msg: string) => {
          enqueueSnackbar(`Email: ${msg}`, { variant: "error" });
        });
      }
      if (data.username) {
        data.username.forEach((msg: string) => {
          enqueueSnackbar(`Username: ${msg}`, { variant: "error" });
        });
      }
    } else {
      enqueueSnackbar("Server error", { variant: "error" });
    }
  };

  const getSettings = async () => {
    const data = await getUser();
    setSettings(data);
  };

  useEffect(() => {
    getSettings();
  }, []);
  return (
    <>
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Grid item>
          <Typography variant="h5">Settings</Typography>
        </Grid>
        {settings && (
          <>
            <Grid item>
              <TextField
                margin="normal"
                id="email"
                label="Email Address"
                name="email"
                value={settings.email}
                onChange={handleEmailChange}
                autoComplete="email"
                autoFocus
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                margin="normal"
                id="username"
                label="Username"
                name="username"
                defaultValue={settings.username}
                onChange={handleUsernameChange}
                autoComplete="username"
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setOpenDataModal(true)}
              >
                Edit data
              </Button>
              <EditUserDataModal
                open={openDataModal}
                handleClose={() => setOpenDataModal(false)}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setOpenChangePasswordModal(true)}
              >
                Change password
              </Button>
              <ChangePasswordModal
                open={openChangePasswordModal}
                handleClose={() => setOpenChangePasswordModal(false)}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleSubmit}>
                Update
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Settings;
