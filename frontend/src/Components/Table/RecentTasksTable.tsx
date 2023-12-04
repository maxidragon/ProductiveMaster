import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { TaskForProject } from "../../logic/interfaces";
import RecentTaskRow from "./Row/RecentTaskRow";

interface Props {
  tasks: TaskForProject[];
  isProjectOwner: boolean;
}

const RecentTasksTable = ({ tasks, isProjectOwner }: Props): JSX.Element => {
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
            <RecentTaskRow
              key={task.id}
              task={task}
              isProjectOwner={isProjectOwner}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentTasksTable;
