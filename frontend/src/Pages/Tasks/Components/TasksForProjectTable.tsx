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
import { TaskForProject } from "../../../logic/interfaces";
import PaginationFooter from "../../../Components/Pagination/PaginationFooter";
import TaskForProjectRow from "./TaskForProjectRow";

interface Props {
  tasks: TaskForProject[];
  page: number;
  totalPages: number;
  totalItems: number;
  isProjectOwner: boolean;
  handlePageChange: (page: number) => void;
  status?: string;
  fetchData: (pageParam: number, statusParam?: string) => void;
}

const TasksForProjectTable = ({
  tasks,
  page,
  totalPages,
  totalItems,
  isProjectOwner,
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
            <TableCell>Status</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>PR</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task: TaskForProject) => (
            <TaskForProjectRow
              key={task.id}
              task={task}
              isProjectOwner={isProjectOwner}
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

export default TasksForProjectTable;
