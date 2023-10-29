import { Modal, Box, TextField, Typography, Grid, Button } from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  getUserData,
  removeAvatar,
  updateAvatar,
  updateUserData,
} from "../../../logic/auth";
import ActionsButtons from "../ActionsButtons";
import { UserData } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";

const EditUserDataModal = (props: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [data, setData] = useState<UserData>({
    github_profile: "",
    wakatime_api_key: "",
    gprm_stats: "",
    gprm_streak: "",
    gprm_languages: "",
  });
  const [avatar, setAvatar] = useState<File>();
  const handleEdit = async () => {
    const status = await updateUserData(data);
    if (avatar) {
      const avatarStatus = await updateAvatar(avatar);
      if (avatarStatus === 200) {
        enqueueSnackbar("Your avatar has been updated", { variant: "success" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    }

    if (status === 200) {
      enqueueSnackbar("Your data has been updated", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const handleDeleteAvatar = async () => {
    const status = await removeAvatar();
    if (status === 200) {
      enqueueSnackbar("Your avatar has been deleted", { variant: "success" });
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData();
      setData(data);
    };
    getData();
  }, []);
  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={style}>
          <Grid container sx={formStyle}>
            <Grid item>
              <Typography variant="h4">Edit user data</Typography>
            </Grid>
            {data && (
              <>
                <Grid item>
                  <TextField
                    margin="normal"
                    label="Github profile"
                    autoFocus
                    value={data.github_profile}
                    onChange={(event) =>
                      setData({ ...data, github_profile: event.target.value })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    margin="normal"
                    label="Wakatime API key"
                    autoFocus
                    value={data.wakatime_api_key}
                    onChange={(event) =>
                      setData({ ...data, wakatime_api_key: event.target.value })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    margin="normal"
                    label="GPRM stats link"
                    autoFocus
                    value={data.gprm_stats}
                    onChange={(event) =>
                      setData({ ...data, gprm_stats: event.target.value })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    margin="normal"
                    label="GPRM streak link"
                    autoFocus
                    value={data.gprm_streak}
                    onChange={(event) =>
                      setData({ ...data, gprm_streak: event.target.value })
                    }
                  />
                </Grid>
                <Grid item>
                  <TextField
                    margin="normal"
                    label="GPRM languages link"
                    autoFocus
                    value={data.gprm_languages}
                    onChange={(event) =>
                      setData({ ...data, gprm_languages: event.target.value })
                    }
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" component="label">
                    Upload Avatar
                    <input
                      accept="image/*"
                      id="contained-button-file"
                      multiple
                      type="file"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        if (event.target.files) {
                          setAvatar(event.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAvatar}
                  >
                    Delete Avatar
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
          <ActionsButtons
            cancel={props.handleClose}
            submit={handleEdit}
            submitText={"Edit"}
            submitIcon={<EditIcon />}
          />
        </Box>
      </Modal>
    </>
  );
};

export default EditUserDataModal;
