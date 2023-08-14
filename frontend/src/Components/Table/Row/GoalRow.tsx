import { useState } from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Goal } from '../../../logic/interfaces';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useConfirm } from 'material-ui-confirm';
import { enqueueSnackbar } from 'notistack';
import { formatDateTime } from '../../../logic/other';
import { deleteGoalById } from '../../../logic/goals';
import EditGoalModal from '../../ModalComponents/Edit/EditGoalModal';

const GoalRow = ({ goal }: { goal: Goal }) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedGoal, setEditedGoal] = useState<Goal>(goal);
  const handleDelete = async () => {
    if (goal === null) return;
    confirm({ description: 'Are you sure you want to delete this goal?' })
      .then(async () => {
        const status = await deleteGoalById(goal.id);
        if (status === 204) {
          enqueueSnackbar('Goal deleted!', { variant: 'success' });
          setHide(true);
        } else {
          enqueueSnackbar('Something went wrong!', { variant: 'error' });
        }
      })
      .catch(() => {
        enqueueSnackbar('Goal not deleted!', { variant: 'info' });
      });
  };
  const editGoal = (goal: Goal) => {
    setEditedGoal(goal);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedGoal.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {editedGoal.title}
          </TableCell>
          <TableCell>{editedGoal.description}</TableCell>
          <TableCell>
            {editedGoal.goal_category
              ? editedGoal.goal_category.title
              : 'Uncategorized'}
          </TableCell>
          <TableCell>{formatDateTime(new Date(editedGoal.deadline))}</TableCell>
          <TableCell>
            {new Date(editedGoal.deadline).getTime() < new Date().getTime()
              ? editedGoal.is_achieved
                ? 'Achieved'
                : 'Failed'
              : ''}
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
        <EditGoalModal
          open={edit}
          handleClose={() => setEdit(false)}
          goal={editedGoal}
          updateGoal={editGoal}
        />
      )}
    </>
  );
};

export default GoalRow;
