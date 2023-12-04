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

interface Props {
  users: ProjectParticipant[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
  isProjectOwner: boolean;
}

const ProjectParticipantsTable = ({
  users,
  page,
  totalPages,
  totalItems,
  handlePageChange,
  isProjectOwner,
}: Props): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Added by</TableCell>
            <TableCell>Role</TableCell>
            {isProjectOwner && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: ProjectParticipant) => (
            <ProjectParticipantRow
              key={user.id}
              user={user}
              isProjectOwner={isProjectOwner}
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

export default ProjectParticipantsTable;
