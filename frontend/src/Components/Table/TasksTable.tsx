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
import { Task } from "../../logic/interfaces";
import TaskRow from "./Row/TaskRow";
import PaginationFooter from "../Pagination/PaginationFooter";

interface Props {
  tasks: Task[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
  status?: string;
  fetchData: (pageParam: number, statusParam?: string) => void;
}

const TasksTable = ({
  tasks,
  page,
  totalPages,
  totalItems,
  handlePageChange,
  status,
  fetchData,
}: Props): JSX.Element => {
  const handleStatusUpdate = (statusParam: string): void => {
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
            <TableCell>Project</TableCell>
            <TableCell>Tasks for project</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>PR</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task: Task) => (
            <TaskRow
              key={task.id}
              task={task}
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

export default TasksTable;
