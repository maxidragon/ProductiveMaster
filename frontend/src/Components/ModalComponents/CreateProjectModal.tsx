import { useRef } from "react";
import {Box, Typography, Modal, TextField, Button} from "@mui/material";
import { style } from "./modalStyles";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { enqueueSnackbar } from "notistack";
import { createProject } from "../../logic/projects";

const CreateProjectModal = (props: { open: boolean; handleClose: any }) => {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();
  const githubLinkRef: any = useRef();

  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const github = githubLinkRef.current.value;
    const status = await createProject(title, description, github);
    if (status === 201) {
      enqueueSnackbar("Project created!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  }
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create project
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          inputRef={titleRef}
        />
        <TextField
          placeholder={"Github"}
          fullWidth
          inputRef={githubLinkRef}
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write project description  here..."}
          fullWidth
          inputRef={descriptionRef}
        />
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleCreate}>Create</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default CreateProjectModal;
