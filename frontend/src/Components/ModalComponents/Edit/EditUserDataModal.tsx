import { useEffect, useState } from "react";
import { Modal, Box, TextField, Typography, Button } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import {
  getUserData,
  removeAvatar,
  updateAvatar,
  updateUserData,
} from "../../../logic/auth";
import { ModalProps, UserData } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

const EditUserDataModal = ({ open, handleClose }: ModalProps): JSX.Element => {
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
      handleClose();
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h4">Edit user data</Typography>
          {data && (
            <>
              <TextField
                margin="normal"
                label="Github profile"
                autoFocus
                value={data.github_profile}
                onChange={(event) =>
                  setData({ ...data, github_profile: event.target.value })
                }
              />
              <TextField
                margin="normal"
                label="Wakatime API key"
                autoFocus
                value={data.wakatime_api_key}
                onChange={(event) =>
                  setData({ ...data, wakatime_api_key: event.target.value })
                }
              />
              <TextField
                margin="normal"
                label="GPRM stats link"
                autoFocus
                value={data.gprm_stats}
                onChange={(event) =>
                  setData({ ...data, gprm_stats: event.target.value })
                }
              />
              <TextField
                margin="normal"
                label="GPRM streak link"
                autoFocus
                value={data.gprm_streak}
                onChange={(event) =>
                  setData({ ...data, gprm_streak: event.target.value })
                }
              />
              <TextField
                margin="normal"
                label="GPRM languages link"
                autoFocus
                value={data.gprm_languages}
                onChange={(event) =>
                  setData({ ...data, gprm_languages: event.target.value })
                }
              />
              <Typography variant="h6">{avatar && avatar.name}</Typography>
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
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAvatar}
              >
                Delete Avatar
              </Button>
            </>
          )}
          <ActionsButtons
            cancel={handleClose}
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
