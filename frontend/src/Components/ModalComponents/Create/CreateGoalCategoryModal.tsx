import { useRef } from "react";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createGoalCategory } from "../../../logic/goalCategories";
import { ModalProps } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

const CreateGoalCategoryModal = ({
  open,
  handleClose,
}: ModalProps): JSX.Element => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();

  const handleCreate = async () => {
    if (!titleRef.current) return;
    const title = titleRef.current.value;
    const response = await createGoalCategory(title);
    if (response.status === 201) {
      enqueueSnackbar("Category created!", { variant: "success" });
      handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Title: ${error}`, { variant: "error" });
        });
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create goal category
        </Typography>
        <TextField placeholder={"Name"} fullWidth inputRef={titleRef} />
        <ActionsButtons
          cancel={handleClose}
          submit={handleCreate}
          submitText={"Create"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default CreateGoalCategoryModal;
