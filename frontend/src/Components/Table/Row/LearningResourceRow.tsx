import { useState } from "react";
import { TableRow, TableCell, IconButton, Link } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { LearningResource } from "../../../logic/interfaces";
import { deleteLearningResource } from "../../../logic/learningResources";
import EditLearningResourceModal from "../../ModalComponents/Edit/EditLearningResource";

interface Props {
  resource: LearningResource;
}

const LearningResourceRow = ({ resource }: Props): JSX.Element => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedResource, setEditedResource] =
    useState<LearningResource>(resource);
  const handleDelete = async (): Promise<void> => {
    if (resource === null) return;
    confirm({
      description: "Are you sure you want to delete this resource?",
    })
      .then(async () => {
        const status = await deleteLearningResource(resource.id);
        if (status === 204) {
          enqueueSnackbar("Resource deleted!", { variant: "success" });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Resource not deleted!", { variant: "info" });
      });
  };
  const updateResource = (resourceParam: LearningResource): void => {
    setEditedResource(resourceParam);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedResource.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Link href={editedResource.url} target="_blank">
              {editedResource.title}
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
        <EditLearningResourceModal
          open={edit}
          handleClose={() => setEdit(false)}
          resource={editedResource}
          updateResource={updateResource}
        />
      )}
    </>
  );
};

export default LearningResourceRow;
