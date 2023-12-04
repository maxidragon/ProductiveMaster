import { useState } from "react";
import { TableRow, TableCell, IconButton, Link, Tooltip } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { Document as DocumentInterface } from "../../../logic/interfaces";
import { deleteDocument } from "../../../logic/documents";
import AvatarComponent from "../../AvatarComponent";
import EditDocumentModal from "../../ModalComponents/Edit/EditDocumentModal";

interface Props {
  document: DocumentInterface;
  isProjectOwner: boolean;
}

const DocumentRow = ({ document, isProjectOwner }: Props): JSX.Element => {
  const userId = localStorage.getItem("userId") || "";
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedDocument, setEditedDocument] =
    useState<DocumentInterface>(document);
  const handleDelete = async (): Promise<void> => {
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
  const updateDocument = (documentParam: DocumentInterface): void => {
    setEditedDocument(documentParam);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedDocument.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>
            <Link href={editedDocument.url} target="_blank">
              {editedDocument.title}
            </Link>
          </TableCell>
          <TableCell>
            <Tooltip title={editedDocument.owner.username}>
              <IconButton>
                <AvatarComponent
                  userId={editedDocument.owner.id}
                  username={editedDocument.owner.username}
                  size="30px"
                />
              </IconButton>
            </Tooltip>
          </TableCell>
          <TableCell>
            {(+userId === editedDocument.owner.id || isProjectOwner) && (
              <>
                <IconButton onClick={() => setEdit(true)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </TableCell>
        </TableRow>
      )}
      {edit && (
        <EditDocumentModal
          open={edit}
          handleClose={() => setEdit(false)}
          document={editedDocument}
          editDocument={updateDocument}
        />
      )}
    </>
  );
};

export default DocumentRow;
