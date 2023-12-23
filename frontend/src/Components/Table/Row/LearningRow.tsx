import { useState } from "react";
import { TableRow, TableCell, IconButton, Box, Chip } from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { LearningType } from "../../../logic/interfaces";
import { statusPretyName } from "../../../logic/other";
import { deleteLearning } from "../../../logic/learning";
import { Link as RouterLink } from "react-router-dom";
import EditLearningModal from "../../ModalComponents/Edit/EditLearningModal";

interface Props {
  learning: LearningType;
  handleStatusUpdate: (status: string) => void;
}

const LearningRow = ({ learning, handleStatusUpdate }: Props): JSX.Element => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedLearning, setEditedLearning] = useState<LearningType>(learning);

  const handleDelete = async (): Promise<void> => {
    if (learning === null) return;
    confirm({ description: "Are you sure you want to delete this item?" })
      .then(async () => {
        const status = await deleteLearning(learning.id.toString());
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
  const editLearning = (learning: LearningType): void => {
    setEditedLearning(learning);
  };

  const handleCloseEditModal = (): void => {
    setEdit(false);
    handleStatusUpdate(editedLearning.status);
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
          <TableCell>{editedLearning.learning_category.name}</TableCell>
          <TableCell>
            <Box sx={{ display: "inline-block", ml: 1 }}>
              <Chip
                label={statusPretyName(editedLearning.status)}
                color={
                  editedLearning.status === "TO_LEARN"
                    ? "primary"
                    : editedLearning.status === "IN_PROGRESS"
                    ? "warning"
                    : "success"
                }
              />
            </Box>
          </TableCell>
          <TableCell>
            <IconButton
              component={RouterLink}
              to={`/learning/${editedLearning.id}/resources`}
            >
              <DescriptionIcon />
            </IconButton>
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
