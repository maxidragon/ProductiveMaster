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
  isProjectOwner: boolean;
  totalPages: number;
  totalItems: number;
  handlePageChange: (page: number) => void;
}) => {
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
          {props.documents.map((document: DocumentInterface) => (
            <DocumentRow
              key={document.id}
              document={document}
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

export default DocumentsTable;
