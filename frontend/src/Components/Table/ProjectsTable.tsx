import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter
} from '@mui/material';
import { Project } from '../../logic/interfaces';

import ProjectRow from './Row/ProjectRow';
import PaginationFooter from '../Pagination/PaginationFooter';

const ProjectsTable = (props: {
  projects: Project[];
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Titlte</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Tasks (TODO, in progress, done)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.projects.map((project: Project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </TableBody>
        {props.totalPages > 0 && (
          <TableFooter>
            <PaginationFooter
              page={props.page}
              totalPages={props.totalPages}
              handlePageChange={props.handlePageChange}
            />
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default ProjectsTable;
