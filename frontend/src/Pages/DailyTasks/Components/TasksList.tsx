import { Box, List, Paper, Typography } from "@mui/material";
import { DailyTask } from "../../../logic/interfaces";
import TaskItem from "./TaskItem";

interface TasksListProps {
  tasks: DailyTask[];
  fetchData: () => void;
}

const TasksList = ({ tasks, fetchData }: TasksListProps) => {
  if (tasks.length === 0) return <Typography variant="h6">No tasks</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Paper
        sx={{
          width: {
            xs: "100%",
            sm: "60%",
          },
        }}
      >
        <List>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} fetchData={fetchData} />
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TasksList;
