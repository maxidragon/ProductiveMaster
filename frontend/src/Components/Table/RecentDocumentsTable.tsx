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

interface Props {
  documents: DocumentInterface[];
  isProjectOwner: boolean;
}

const RecentDocumentsTable = ({
  documents,
  isProjectOwner,
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
      </Table>
    </TableContainer>
  );
};

export default RecentDocumentsTable;
