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
import { Document as DocumentInterface } from "../../logic/interfaces";
import PaginationFooter from "../Pagination/PaginationFooter";
import DocumentRow from "./Row/DocumentRow";

interface Props {
  documents: DocumentInterface[];
  page: number;
  isProjectOwner: boolean;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
}

const DocumentsTable = ({
  documents,
  page,
  isProjectOwner,
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
            <TableCell>Owner</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((document: DocumentInterface) => (
            <DocumentRow
              key={document.id}
              document={document}
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

export default DocumentsTable;
