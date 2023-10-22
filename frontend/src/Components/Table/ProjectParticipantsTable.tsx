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
import { ProjectParticipant } from "../../logic/interfaces";
import PaginationFooter from "../Pagination/PaginationFooter";
import ProjectParticipantRow from "./Row/ProjectParticipantRow";

const ProjectParticipantsTable = (props: {
  users: ProjectParticipant[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
  isProjectOwner: boolean;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Added by</TableCell>
            <TableCell>Role</TableCell>
            {props.isProjectOwner && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users.map((user: ProjectParticipant) => (
            <ProjectParticipantRow
              key={user.id}
              user={user}
              isProjectOwner={props.isProjectOwner}
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

export default ProjectParticipantsTable;
