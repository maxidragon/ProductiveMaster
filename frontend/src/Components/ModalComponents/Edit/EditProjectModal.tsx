import {
  Box,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { updateProject } from "../../../logic/projects";
import { ModalProps, Project } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

interface Props extends ModalProps {
  project: Project;
  editProject: (project: Project) => void;
}

const EditProjectModal = ({
  open,
  handleClose,
  project,
  editProject,
}: Props): JSX.Element => {
  const handleEdit = async () => {
    const response = await updateProject(project);
    if (response.status === 200) {
      enqueueSnackbar("Project updated!", { variant: "success" });
      handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      if (response.data.title) {
        response.data.title.forEach((error: string) => {
          enqueueSnackbar(`Title: ${error}`, { variant: "error" });
        });
      }
      if (response.data.description) {
        response.data.description.forEach((error: string) => {
          enqueueSnackbar(`Description: ${error}`, { variant: "error" });
        });
      }
      if (response.data.github) {
        response.data.github.forEach((error: string) => {
          enqueueSnackbar(`Github: ${error}`, { variant: "error" });
        });
      }
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit project
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={project.title}
          onChange={(event) =>
            editProject({
              ...project,
              title: event.target.value,
            })
          }
        />
        <TextField
          placeholder={"Github"}
          fullWidth
          value={project.github}
          onChange={(event) =>
            editProject({
              ...project,
              github: event.target.value,
            })
          }
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write project description here..."}
          fullWidth
          value={project.description}
          onChange={(event) =>
            editProject({
              ...project,
              description: event.target.value,
            })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="status">Status</InputLabel>
          <Select
            labelId="status"
            label="Status"
            required
            name="status"
            value={project.status}
            onChange={(event) =>
              editProject({
                ...project,
                status: event.target.value,
              })
            }
          >
            <MenuItem value={"PLANNED"}>Planned</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>
          </Select>
        </FormControl>
        <ActionsButtons
          cancel={handleClose}
          submit={handleEdit}
          submitText={"Edit"}
          submitIcon={<EditIcon />}
        />
      </Box>
    </Modal>
  );
};

export default EditProjectModal;
