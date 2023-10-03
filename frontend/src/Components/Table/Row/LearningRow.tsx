import { useState } from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import { LearningType } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { statusPretyName } from "../../../logic/other";
import { deleteLearning } from "../../../logic/learning";
import EditLearningModal from "../../ModalComponents/Edit/EditLearningModal";

const LearningRow = (props: {
  learning: LearningType;
  handleStatusUpdate: (status: string) => void;
}) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedLearning, setEditedLearning] = useState<LearningType>(
    props.learning,
  );
  const handleDelete = async () => {
    if (props.learning === null) return;
    confirm({ description: "Are you sure you want to delete this item?" })
      .then(async () => {
        const status = await deleteLearning(props.learning.id.toString());
        if (status === 204) {
          enqueueSnackbar("Learning deleted!", { variant: "success" });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Learning not deleted!", { variant: "info" });
      });
  };
  const editLearning = (learning: LearningType) => {
    setEditedLearning(learning);
  };

  const handleCloseEditModal = () => {
    setEdit(false);
    props.handleStatusUpdate(editedLearning.status);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedLearning.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {editedLearning.title}
          </TableCell>
          <TableCell>{editedLearning.description}</TableCell>
          <TableCell>{statusPretyName(editedLearning.status)}</TableCell>
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
        <EditLearningModal
          open={edit}
          handleClose={handleCloseEditModal}
          learning={editedLearning}
          updateLearning={editLearning}
        />
      )}
    </>
  );
};

export default LearningRow;
