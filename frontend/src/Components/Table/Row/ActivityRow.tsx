import { useState } from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import { Activity } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { deleteActivity } from "../../../logic/activities";
import { formatDateTime } from "../../../logic/other";
import EditActivityModal from "../../ModalComponents/Edit/EditActivityModal";

const ActivityRow = ({ activity }: { activity: Activity }) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedActivity, setEditedActivity] = useState<Activity>(activity);
  const handleDelete = async () => {
    if (activity === null) return;
    confirm({ description: "Are you sure you want to delete this activity?" })
      .then(async () => {
        const status = await deleteActivity(activity.id);
        if (status === 204) {
          enqueueSnackbar("Activity deleted!", { variant: "success" });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Activity not deleted!", { variant: "info" });
      });
  };
  const editActivity = (activity: Activity) => {
    setEditedActivity(activity);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedActivity.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {editedActivity.title}
          </TableCell>
          <TableCell>{editedActivity.description}</TableCell>
          <TableCell>
            {formatDateTime(new Date(editedActivity.start_time))}
          </TableCell>
          <TableCell>
            {formatDateTime(new Date(editedActivity.end_time))}
          </TableCell>
          <TableCell>
            <IconButton onClick={() => setEdit(true)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )}
      {edit && (
        <EditActivityModal
          open={edit}
          handleClose={() => setEdit(false)}
          activity={editedActivity}
          updateActivity={editActivity}
        />
      )}
    </>
  );
};

export default ActivityRow;
