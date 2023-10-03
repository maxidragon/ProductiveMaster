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

const LearningCategoriesTable = (props: {
  learningCategories: LearningCategory[];
  page: number;
  totalPages: number;
  totalItems: number;
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
          {props.learningCategories.map(
            (learningCategory: LearningCategory) => (
              <LearningCategoryRow
                key={learningCategory.id}
                learningCategory={learningCategory}
              />
            ),
          )}
        </TableBody>
        {props.totalPages > 0 && (
          <TableFooter>
            <PaginationFooter
              page={props.page}
              totalPages={props.totalPages}
              totalItems={props.totalItems}
              handlePageChange={props.handlePageChange}
            />
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default LearningCategoriesTable;
