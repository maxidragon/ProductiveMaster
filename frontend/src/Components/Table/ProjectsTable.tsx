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
import { Project } from "../../logic/interfaces";
import ProjectRow from "./Row/ProjectRow";
import PaginationFooter from "../Pagination/PaginationFooter";

interface Props {
  projects: Project[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
  status?: string;
  fetchData: (pageParam: number, statusParam?: string) => void;
}

const ProjectsTable = ({
  projects,
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
            <TableCell>Titlte</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project: Project) => (
            <ProjectRow
              key={project.id}
              project={project}
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

export default ProjectsTable;
