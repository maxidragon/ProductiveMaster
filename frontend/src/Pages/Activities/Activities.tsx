import { Box, IconButton, LinearProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { getActivitiesForDay } from "../../logic/activities";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateActivityModal from "../../Components/ModalComponents/Create/CreateActivityModal";
import { Activity } from "../../logic/interfaces";
import ActivitiesTable from "../../Components/Table/ActivitiesTable";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Dayjs>(dayjs(new Date()));
  const fetchData = useCallback(async () => {
    const formattedDate = dayjs(date).toISOString();
    const data = await getActivitiesForDay(new Date(formattedDate));
    setActivities(data);
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
        <>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <DatePicker
              value={dayjs(date)}
              onChange={(date) => setDate(dayjs(date))}
            />
            <IconButton onClick={() => setCreateModalOpen(true)}>
              <AddCircleIcon />
            </IconButton>
          </Box>

          <ActivitiesTable activities={activities} />
          {createModalOpen && (
            <CreateActivityModal
              open={createModalOpen}
              handleClose={handleCloseCreateModal}
            />
          )}
        </>
      )}
    </>
  );
};

export default Activities;
