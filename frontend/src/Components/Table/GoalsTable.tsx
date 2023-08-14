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

const GoalsTable = (props: {
  goals: Goal[];
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
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Is achieved</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.goals.map((goal: Goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}
          {props.totalPages > 0 && (
            <TableFooter>
              <PaginationFooter
                page={props.page}
                totalPages={props.totalPages}
                handlePageChange={props.handlePageChange}
              />
            </TableFooter>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GoalsTable;
