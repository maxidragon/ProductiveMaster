import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Document as DocumentInterface } from "../../logic/interfaces";
import DocumentRow from "./Row/DocumentRow";

const RecentDocumentsTable = (props: {
  documents: DocumentInterface[];
  isProjectOwner: boolean;
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
      </Table>
    </TableContainer>
  );
};

export default RecentDocumentsTable;
