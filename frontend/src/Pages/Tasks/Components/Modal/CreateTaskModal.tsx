import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { AddCircle as AddCircleIcon } from "@mui/icons-material";
import { style } from "../../../../Components/ModalComponents/modalStyles";
import { enqueueSnackbar } from "notistack";
import { createTask } from "../../../../logic/tasks";
import { getProjectParticipants } from "../../../../logic/projectParticipants";
import {
  ProjectModalProps,
  ProjectParticipant,
} from "../../../../logic/interfaces";
import ActionsButtons from "../../../../Components/ModalComponents/ActionsButtons";
import AvatarComponent from "../../../../Components/AvatarComponent";

const CreateTaskModal = ({
  open,
  handleClose,
  projectId,
}: ProjectModalProps): JSX.Element => {
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
  const [participants, setParticipants] = useState<ProjectParticipant[]>([]);
  const [assignee, setAssignee] = useState<number>();

  const handleCreate = async () => {
    if (!titleRef.current || !descriptionRef.current || !githubLinkRef.current)
      return;
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const github = githubLinkRef.current.value;
    const highPriority = highPriorityRef.current.checked;
    const response = await createTask(
      projectId,
      title,
      description,
      highPriority,
      github,
      assignee,
    );
    if (response.status === 201) {
      enqueueSnackbar("Task created!", { variant: "success" });
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
      if (response.data.issue) {
        response.data.issue.forEach((error: string) => {
          enqueueSnackbar(`Issue: ${error}`, { variant: "error" });
        });
      }
      if (response.data.high_priority) {
        response.data.high_priority.forEach((error: string) => {
          enqueueSnackbar(`High priority: ${error}`, { variant: "error" });
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjectParticipants(+projectId);
      setParticipants(data.results);
    };

    fetchData();
  }, [projectId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create task
        </Typography>
        <TextField placeholder={"Title"} fullWidth inputRef={titleRef} />
        <TextField
          placeholder={"Github issue"}
          fullWidth
          inputRef={githubLinkRef}
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write task description here..."}
          fullWidth
          inputRef={descriptionRef}
        />
        <FormControlLabel
          control={<Checkbox inputRef={highPriorityRef} />}
          label="High priority"
        />
        <FormControl fullWidth>
          <InputLabel id="assigneLabel">Assignee</InputLabel>
          <Select
            labelId="assigneLabel"
            value={assignee}
            label="Assignee"
            onChange={(e) => setAssignee(+e.target.value)}
          >
            <MenuItem value={0}>No assignee</MenuItem>
            {participants &&
              participants.map((participant) => (
                <MenuItem
                  value={participant.user.id}
                  sx={{ display: "flex", gap: 1 }}
                >
                  <AvatarComponent
                    userId={participant.user.id}
                    username={participant.user.username}
                    size="30px"
                  />
                  {participant.user.username}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
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

export default CreateTaskModal;
