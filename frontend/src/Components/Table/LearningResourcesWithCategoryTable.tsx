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
import { LearningResourceWithCategory } from "../../logic/interfaces";
import PaginationFooter from "../Pagination/PaginationFooter";
import LearningResourceWithCategoryRow from "./Row/LearningResourceWithCategoryRow";

interface Props {
  resources: LearningResourceWithCategory[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
}

const LearningResourcesWithCategoryTable = ({
  resources,
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
            <TableCell>Title</TableCell>
            <TableCell>Learning</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map((resource: LearningResourceWithCategory) => (
            <LearningResourceWithCategoryRow
              key={resource.id}
              resource={resource}
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

export default LearningResourcesWithCategoryTable;
