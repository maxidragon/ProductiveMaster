import { useRef } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { formStyle, style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { createTask } from "../../../logic/tasks";
import ActionsButtons from "../ActionsButtons";

const CreateTaskModal = (props: {
  open: boolean;
  handleClose: () => void;
  projectId: string;
}) => {
  const titleRef: React.MutableRefObject<HTMLInputElement | null | undefined> =
    useRef();
  const descriptionRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  const githubLinkRef: React.MutableRefObject<
    HTMLInputElement | null | undefined
  > = useRef();
  //eslint-disable-next-line
  const highPriorityRef: any = useRef();

  const handleCreate = async () => {
    if (!titleRef.current || !descriptionRef.current || !githubLinkRef.current)
      return;
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const github = githubLinkRef.current.value;
    const highPriority = highPriorityRef.current.checked;
    const status = await createTask(
      props.projectId,
      title,
      description,
      highPriority,
      github,
    );
    if (status === 201) {
      enqueueSnackbar("Task created!", { variant: "success" });
      props.handleClose();
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create task
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
          </Grid>
          <Grid item>
            <TextField
              placeholder={"Github issue"}
              fullWidth
              inputRef={githubLinkRef}
            />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={"Write task description  here..."}
              fullWidth
              inputRef={descriptionRef}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<Checkbox inputRef={highPriorityRef} />}
              label="High priority"
            />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleCreate}
          submitText={"Create"}
        />
      </Box>
    </Modal>
  );
};

export default CreateTaskModal;
