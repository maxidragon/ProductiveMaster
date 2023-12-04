import { GoalCategory } from "../../logic/interfaces";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from "@mui/material";
import GoalCategoryRow from "./Row/GoalCategoryRow";
import PaginationFooter from "../Pagination/PaginationFooter";

interface Props {
  goalCategories: GoalCategory[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
}

const GoalCategoriesTable = ({
  goalCategories,
  page,
  totalPages,
  totalItems,
  handlePageChange,
}: Props): JSX.Element => {
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
          {goalCategories.map((goalCategory: GoalCategory) => (
            <GoalCategoryRow
              key={goalCategory.id}
              goalCategory={goalCategory}
            />
          ))}
        </TableBody>
        {totalPages > 0 && (
          <TableFooter>
            <PaginationFooter
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              handlePageChange={handlePageChange}
            />
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default GoalCategoriesTable;
