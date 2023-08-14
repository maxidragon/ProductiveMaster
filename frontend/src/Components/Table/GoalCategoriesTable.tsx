import { GoalCategory } from '../../logic/interfaces';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@mui/material';
import GoalCategoryRow from './Row/GoalCategoryRow';
import PaginationFooter from '../Pagination/PaginationFooter';

const GoalCategoriesTable = (props: {
  goalCategories: GoalCategory[];
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {

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
        {props.totalPages > 0 && (
          <TableFooter>
            <PaginationFooter page={props.page} totalPages={props.totalPages} handlePageChange={props.handlePageChange} />
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default GoalCategoriesTable;