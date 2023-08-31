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

const TasksTable = (props: {
  tasks: Task[];
  multipleProjects?: boolean;
  page: number;
  totalPages: number;
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
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            {props.multipleProjects && <TableCell>Project</TableCell>}
            {props.multipleProjects && <TableCell>Tasks for project</TableCell>}
            <TableCell>Status</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>PR</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.tasks.map((task: Task) => (
            <TaskRow
              key={task.id}
              task={task}
              multipleProjects={props.multipleProjects}
              handleStatusUpdate={handleStatusUpdate}
            />
          ))}
        </TableBody>
        {props.totalPages > 0 && (
          <TableFooter>
            <PaginationFooter
              page={props.page}
              totalPages={props.totalPages}
              totalItems={props.tasks.length}
              handlePageChange={props.handlePageChange}
            />
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default TasksTable;
