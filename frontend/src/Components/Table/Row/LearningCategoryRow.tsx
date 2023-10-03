import { useState } from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import { LearningCategory } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { deleteLearningCategory } from "../../../logic/learningCategories";
import EditLearningCategoryModal from "../../ModalComponents/Edit/EditLearningCategoryModal";

const LearningCategoryRow = ({
  learningCategory,
}: {
  learningCategory: LearningCategory;
}) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedLearningCategory, setEditedLearningCategory] =
    useState<LearningCategory>(learningCategory);
  const handleDelete = async () => {
    if (learningCategory === null) return;
    confirm({ description: "Are you sure you want to delete this category?" })
      .then(async () => {
        const status = await deleteLearningCategory(learningCategory.id);
        if (status === 204) {
          enqueueSnackbar("Category deleted!", { variant: "success" });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Goal not deleted!", { variant: "info" });
      });
  };
  const editLearningCategory = (category: LearningCategory) => {
    setEditedLearningCategory(category);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedLearningCategory.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {editedLearningCategory.name}
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
        <EditLearningCategoryModal
          open={edit}
          handleClose={() => setEdit(false)}
          learningCategory={editedLearningCategory}
          updateLearningCategory={editLearningCategory}
        />
      )}
    </>
  );
};

export default LearningCategoryRow;
