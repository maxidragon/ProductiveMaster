import { Goal } from "../../logic/interfaces";
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
import GoalRow from "./Row/GoalRow";
import PaginationFooter from "../Pagination/PaginationFooter";

interface Props {
  goals: Goal[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
}

const GoalsTable = ({
  goals,
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
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Is achieved</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {goals.map((goal: Goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}
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
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GoalsTable;
