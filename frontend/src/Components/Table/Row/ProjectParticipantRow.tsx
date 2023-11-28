import { useState } from "react";
import { TableRow, TableCell, IconButton, Grid, Tooltip } from "@mui/material";
import { ProjectParticipant } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { deleteProjectParticipant } from "../../../logic/projectParticipants";
import EditProjectParticipantModal from "../../ModalComponents/Edit/EditProjectParticipantModal";
import AvatarComponent from "../../AvatarComponent";

const ProjectParticipantRow = ({
  user,
  isProjectOwner,
}: {
  user: ProjectParticipant;
  isProjectOwner: boolean;
}) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedUser, setEditedUser] = useState<ProjectParticipant>(user);

  const handleDelete = () => {
    console.log(user);
    if (user === null) return;
    confirm({
      description:
        "Are you sure you want to delete this user from the project?",
    })
      .then(async () => {
        const status = await deleteProjectParticipant(user.id);
        console.log(status);
        if (status === 204) {
          enqueueSnackbar("User succesfully removed from the project", {
            variant: "success",
          });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("User not deleted!", { variant: "info" });
      });
  };
  const updateUser = (userParam: ProjectParticipant) => {
    setEditedUser(userParam);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedUser.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <AvatarComponent
                  userId={editedUser.user.id}
                  username={editedUser.user.username}
                  size="30px"
                />
              </Grid>
              <Grid item>{editedUser.user.username}</Grid>
            </Grid>
          </TableCell>
          <TableCell>
            <Tooltip title={editedUser.added_by.username}>
              <IconButton>
                <AvatarComponent
                  userId={editedUser.added_by.id}
                  username={editedUser.added_by.username}
                  size="30px"
                />
              </IconButton>
            </Tooltip>
          </TableCell>
          <TableCell>{editedUser.is_owner ? "Owner" : "Participant"}</TableCell>
          {isProjectOwner && (
            <TableCell>
              <IconButton onClick={() => setEdit(true)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          )}
        </TableRow>
      )}
      {edit && (
        <EditProjectParticipantModal
          open={edit}
          handleClose={() => setEdit(false)}
          user={editedUser}
          updateUser={updateUser}
        />
      )}
    </>
  );
};

export default ProjectParticipantRow;
