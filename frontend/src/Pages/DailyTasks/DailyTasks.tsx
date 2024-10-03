import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DailyTask } from "../../logic/interfaces";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { getDailyTasks } from "../../logic/dailyTasks";
import { formatDate } from "../../logic/other";
import TasksList from "./Components/TasksList";
import CreateDailyTaskModal from "./Components/CreateDailyTaskModal";

const DailyTasks = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Dayjs>(dayjs(new Date()));
  const completedTasks = tasks.filter((task) => task.completed_at);
  const incompleteTasks = tasks.filter((task) => !task.completed_at);

  const fetchData = useCallback(async () => {
    const formattedDate = dayjs(date).toISOString();
    const data = await getDailyTasks(new Date(formattedDate));
    setTasks(data);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [date]);

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <DatePicker
              value={dayjs(date)}
              onChange={(date) => setDate(dayjs(date))}
            />
            <IconButton onClick={() => setCreateModalOpen(true)}>
              <AddCircleIcon />
            </IconButton>
          </Box>
          <Typography variant="h5">
            Tasks for {formatDate(new Date(dayjs(date).toISOString()))}
          </Typography>
          <TasksList tasks={incompleteTasks} fetchData={fetchData} />
          <Typography variant="h5">Completed tasks</Typography>
          <TasksList tasks={completedTasks} fetchData={fetchData} />
          {createModalOpen && (
            <CreateDailyTaskModal
              open={createModalOpen}
              date={new Date(dayjs(date).toISOString())}
              handleClose={handleCloseCreateModal}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default DailyTasks;
