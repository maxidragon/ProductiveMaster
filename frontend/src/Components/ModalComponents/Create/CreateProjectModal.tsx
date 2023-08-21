import { useRef } from "react";
import { Box, Typography, Modal, TextField, Grid } from "@mui/material";
import { style, formStyle } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createProject } from "../../../logic/projects";
import ActionsButtons from "../ActionsButtons";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const CreateProjectModal = (props: {
  open: boolean;
  handleClose: () => void;
}) => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const descriptionRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  const githubLinkRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !descriptionRef.current || !githubLinkRef.current)
      return;
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const github = githubLinkRef.current.value;
    const response = await createProject(title, description, github);
    if (response.status === 201) {
      enqueueSnackbar("Project created!", { variant: "success" });
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
              Create project
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Github"}
              fullWidth
              inputRef={githubLinkRef}
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write project description  here..."}
              fullWidth
              inputRef={descriptionRef}
            />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleCreate}
          submitText={"Create"}
          submitIcon={<AddCircleIcon />}
        />
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;
