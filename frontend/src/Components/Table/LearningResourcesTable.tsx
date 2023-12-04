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
import { LearningResource } from "../../logic/interfaces";
import PaginationFooter from "../Pagination/PaginationFooter";
import LearningResourceRow from "./Row/LearningResourceRow";

interface Props {
  resources: LearningResource[];
  page: number;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
}

const LearningResourcesTable = ({
  resources,
  page,
  totalPages,
  totalItems,
  handlePageChange,
}: Props): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map((resource: LearningResource) => (
            <LearningResourceRow key={resource.id} resource={resource} />
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

export default LearningResourcesTable;
