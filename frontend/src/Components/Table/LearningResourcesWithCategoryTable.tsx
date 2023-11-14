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

const LearningResourcesWithCategoryTable = (props: {
  resources: LearningResourceWithCategory[];
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
            <TableCell>Title</TableCell>
            <TableCell>Learning</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.resources.map((resource: LearningResourceWithCategory) => (
            <LearningResourceWithCategoryRow
              key={resource.id}
              resource={resource}
            />
          ))}
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

export default LearningResourcesWithCategoryTable;
