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

const RecentTasksTable = (props: {
  tasks: TaskForProject[];
  isProjectOwner: boolean;
  fetchData: () => void;
}) => {
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
          {props.tasks.map((task: TaskForProject) => (
            <RecentTaskRow
              key={task.id}
              task={task}
              isProjectOwner={props.isProjectOwner}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentTasksTable;
