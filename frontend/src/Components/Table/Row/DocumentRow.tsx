import { useState } from "react";
import { TableRow, TableCell, IconButton, Link } from "@mui/material";
import { Document as DocumentInterface } from "../../../logic/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import EditDocumentModal from "../../ModalComponents/Edit/EditDocumentModal";
import { deleteDocument } from "../../../logic/documents";

const DocumentRow = ({ document }: { document: DocumentInterface }) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedDocument, setEditedDocument] =
    useState<DocumentInterface>(document);
  const handleDelete = async () => {
    if (document === null) return;
    confirm({
      description: "Are you sure you want to delete this document?",
    })
      .then(async () => {
        const status = await deleteDocument(document.id);
        if (status === 204) {
          enqueueSnackbar("Document deleted!", { variant: "success" });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Document not deleted!", { variant: "info" });
      });
  };
  const updateDocument = (documentParam: DocumentInterface) => {
    setEditedDocument(documentParam);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedDocument.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Link href={editedDocument.url} target="_blank">
              {editedDocument.title}
            </Link>
          </TableCell>

          <TableCell>
            <IconButton onClick={() => setEdit(true)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )}
      {edit && (
        <EditDocumentModal
          open={edit}
          handleClose={() => setEdit(false)}
          document={editedDocument}
          updateDocument={updateDocument}
        />
      )}
    </>
  );
};

export default DocumentRow;
