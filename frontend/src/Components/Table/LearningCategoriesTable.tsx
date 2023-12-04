import { LearningCategory } from "../../logic/interfaces";
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
import PaginationFooter from "../Pagination/PaginationFooter";
import LearningCategoryRow from "./Row/LearningCategoryRow";

interface Props {
  learningCategories: LearningCategory[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
}

const LearningCategoriesTable = ({
  learningCategories,
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
          {learningCategories.map((learningCategory: LearningCategory) => (
            <LearningCategoryRow
              key={learningCategory.id}
              learningCategory={learningCategory}
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

export default LearningCategoriesTable;
