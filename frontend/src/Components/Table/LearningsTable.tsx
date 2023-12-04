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

interface Props {
  learnings: LearningType[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
  status?: string;
  fetchData: (pageParam: number, statusParam?: string) => void;
}

const LearningsTable = ({
  learnings,
  page,
  totalPages,
  totalItems,
  handlePageChange,
  status,
  fetchData,
}: Props): JSX.Element => {
  const handleStatusUpdate = (statusParam: string) => {
    if (status === statusParam) return;
    fetchData(page, status);
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
          {learnings.map((learning: LearningType) => (
            <LearningRow
              key={learning.id}
              learning={learning}
              handleStatusUpdate={handleStatusUpdate}
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

export default LearningsTable;
