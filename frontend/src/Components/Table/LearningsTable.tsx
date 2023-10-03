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
import { LearningType } from "../../logic/interfaces";
import PaginationFooter from "../Pagination/PaginationFooter";
import LearningRow from "./Row/LearningRow";

const LearningsTable = (props: {
  learnings: LearningType[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
  status?: string;
  fetchData: (pageParam: number, statusParam?: string) => void;
}) => {
  const handleStatusUpdate = (status: string) => {
    if (props.status === status) return;
    props.fetchData(props.page, props.status);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.learnings.map((learning: LearningType) => (
            <LearningRow
              key={learning.id}
              learning={learning}
              handleStatusUpdate={handleStatusUpdate}
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

export default LearningsTable;
