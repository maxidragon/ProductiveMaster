import {
  Box,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { updateProject } from "../../../logic/projects";
import { Project } from "../../../logic/interfaces";
import ActionsButtons from "../ActionsButtons";

const EditProjectModal = (props: {
  open: boolean;
  handleClose: () => void;
  project: Project;
  updateProject: (project: Project) => void;
}) => {
  const handleEdit = async () => {
    const response = await updateProject(props.project);
    if (response.status === 200) {
      enqueueSnackbar("Project updated!", { variant: "success" });
      props.handleClose();
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
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit project
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Title"}
              fullWidth
              value={props.project.title}
              onChange={(event) =>
                props.updateProject({
                  ...props.project,
                  title: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Github"}
              fullWidth
              value={props.project.github}
              onChange={(event) =>
                props.updateProject({
                  ...props.project,
                  github: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write project description here..."}
              fullWidth
              value={props.project.description}
              onChange={(event) =>
                props.updateProject({
                  ...props.project,
                  description: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                label="Status"
                required
                name="status"
                value={props.project.status}
                onChange={(event) =>
                  props.updateProject({
                    ...props.project,
                    status: event.target.value,
                  })
                }
              >
                <MenuItem value={"PLANNED"}>Planned</MenuItem>
                <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
                <MenuItem value={"DONE"}>Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleEdit}
          submitText={"Edit"}
        />
      </Box>
    </Modal>
  );
};

export default EditProjectModal;
