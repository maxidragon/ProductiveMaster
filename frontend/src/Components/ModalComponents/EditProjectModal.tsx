import { Box, Typography, Modal, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { style } from "./modalStyles";
import { enqueueSnackbar } from "notistack";
import { updateProject } from "../../logic/projects";
import { Project } from "../../logic/interfaces";
import EditIcon from '@mui/icons-material/Edit';

const EditProjectModal = (props: { open: boolean; handleClose: any, project: Project, updateProject: any }) => {
  const handleEdit = async (event: any) => {
    event.preventDefault();
    const status = await updateProject(props.project);
    if (status === 200) {
      enqueueSnackbar("Project updated!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit project
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={props.project.title}
          onChange={(event) => props.updateProject({ ...props.project, title: event.target.value })}
        />
        <TextField
          placeholder={"Github"}
          fullWidth
          value={props.project.github}
          onChange={(event) => props.updateProject({ ...props.project, github: event.target.value })}
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write project description here..."}
          fullWidth
          value={props.project.description}
          onChange={(event) => props.updateProject({ ...props.project, description: event.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel id="status">Status</InputLabel>
          <Select
            labelId="status"
            label="Status"
            required
            name="status"
            value={props.project.status}
            onChange={(event) => props.updateProject({ ...props.project, status: event.target.value })}
          >
            <MenuItem value={"PLANNED"}>Planned</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>
            </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" endIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
        </Box>
      </Box>
    </Modal>
  )
};

export default EditProjectModal;
