import { useState } from "react";
import { TableRow, TableCell, IconButton, Link } from "@mui/material";
import { LearningResourceWithCategory } from "../../../logic/interfaces";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { deleteLearningResource } from "../../../logic/learningResources";

const LearningResourceWithCategoryRow = ({
  resource,
}: {
  resource: LearningResourceWithCategory;
}) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);

  const handleDelete = async () => {
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

  return (
    <>
      {!hide && (
        <TableRow
          key={resource.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Link href={resource.url} target="_blank">
              {resource.title}
            </Link>
          </TableCell>
          <TableCell>{resource.learning.title}</TableCell>
          <TableCell>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default LearningResourceWithCategoryRow;
