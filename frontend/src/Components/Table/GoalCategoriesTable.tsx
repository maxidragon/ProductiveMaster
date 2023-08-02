import { GoalCategory } from '../../logic/interfaces';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import GoalCategoryRow from './Row/GoalCategoryRow';

const GoalCategoriesTable = (props: { goalCategories: GoalCategory[] }) => {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Titlte</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.goalCategories.map((goalCategory: GoalCategory) => (
            <GoalCategoryRow key={goalCategory.id} goalCategory={goalCategory} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GoalCategoriesTable;