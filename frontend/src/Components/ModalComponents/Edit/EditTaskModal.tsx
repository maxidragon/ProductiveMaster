import {
  Box,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { style } from "../modalStyles";
import { enqueueSnackbar } from "notistack";
import { updateTask } from "../../../logic/tasks";
import {
  ModalProps,
  ProjectParticipant,
  Task,
} from "../../../logic/interfaces";
import { useState, useEffect } from "react";
import { getProjectParticipants } from "../../../logic/projectParticipants";
import ActionsButtons from "../ActionsButtons";
import AvatarComponent from "../../AvatarComponent";

interface Props extends ModalProps {
  task: Task;
  editTask: (task: Task) => void;
}

const EditTaskModal = ({
  open,
  handleClose,
  task,
  editTask,
}: Props): JSX.Element => {
  const [participants, setParticipants] = useState<ProjectParticipant[]>([]);
  const [assignee, setAssignee] = useState<number>(task.assignee || 0);
  const handleEdit = async () => {
    const data = {
      ...task,
      assignee: assignee,
    };
    const response = await updateTask(data);
    if (response.status === 200) {
      enqueueSnackbar("Task updated!", { variant: "success" });
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
      if (response.data.pull_request) {
        response.data.pull_request.forEach((error: string) => {
          enqueueSnackbar(`Pull request: ${error}`, { variant: "error" });
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
      let id = 0;
      if (typeof task.project === "number") {
        id = task.project;
      }
      const data = await getProjectParticipants(id);
      setParticipants(data.results);
    };

    fetchData();
  }, [task.project]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit task
        </Typography>
        <TextField
          placeholder={"Title"}
          fullWidth
          value={task.title}
          onChange={(event) => editTask({ ...task, title: event.target.value })}
        />
        <TextField
          placeholder={"Issue"}
          fullWidth
          value={task.issue}
          onChange={(event) => editTask({ ...task, issue: event.target.value })}
        />
        <TextField
          placeholder={"Pull Request"}
          fullWidth
          value={task.pull_request}
          onChange={(event) =>
            editTask({
              ...task,
              pull_request: event.target.value,
            })
          }
        />
        <TextField
          multiline
          rows={15}
          placeholder={"Write task description here..."}
          fullWidth
          value={task.description}
          onChange={(event) =>
            editTask({
              ...task,
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
            value={task.status}
            onChange={(event) =>
              editTask({
                ...task,
                status: event.target.value,
              })
            }
          >
            <MenuItem value={"TODO"}>To do</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="assigneLabel">Assignee</InputLabel>
          <Select
            labelId="assigneLabel"
            value={assignee}
            label="Assignee"
            onChange={(event) => setAssignee(+event.target.value)}
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
        <FormControlLabel
          control={
            <Checkbox
              checked={task.high_priority}
              onChange={(event) =>
                editTask({
                  ...task,
                  high_priority: event.target.checked,
                })
              }
            />
          }
          label="High priority"
        />
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

export default EditTaskModal;
