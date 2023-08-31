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

const DocumentsTable = (props: {
  documents: DocumentInterface[];
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.documents.map((document: DocumentInterface) => (
            <DocumentRow key={document.id} document={document} />
          ))}
        </TableBody>
        {props.totalPages > 0 && (
          <TableFooter>
            <PaginationFooter
              page={props.page}
              totalPages={props.totalPages}
              totalItems={props.documents.length}
              handlePageChange={props.handlePageChange}
            />
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default DocumentsTable;
