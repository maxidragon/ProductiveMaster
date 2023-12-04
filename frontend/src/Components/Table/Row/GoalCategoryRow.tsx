import { useState } from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { GoalCategory } from "../../../logic/interfaces";
import { deleteGoalCategory } from "../../../logic/goalCategories";
import EditGoalCategoryModal from "../../ModalComponents/Edit/EditGoalCategoryModal";

interface Props {
  goalCategory: GoalCategory;
}

const GoalCategoryRow = ({ goalCategory }: Props): JSX.Element => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedGoalCategory, setEditedGoalCategory] =
    useState<GoalCategory>(goalCategory);
  const handleDelete = async (): Promise<void> => {
    if (goalCategory === null) return;
    confirm({ description: "Are you sure you want to delete this category?" })
      .then(async () => {
        const status = await deleteGoalCategory(goalCategory.id);
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
  const editGoalCategory = (goalCategory: GoalCategory): void => {
    setEditedGoalCategory(goalCategory);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedGoalCategory.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {editedGoalCategory.title}
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
        <EditGoalCategoryModal
          open={edit}
          handleClose={() => setEdit(false)}
          goalCategory={editedGoalCategory}
          editGoalCategory={editGoalCategory}
        />
      )}
    </>
  );
};

export default GoalCategoryRow;
