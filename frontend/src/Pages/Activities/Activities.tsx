import { Box, CircularProgress, IconButton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { getActivitiesForDay } from "../../logic/activities";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateActivityModal from "../../Components/ModalComponents/Create/CreateActivityModal";
import { Activity } from "../../logic/interfaces";
import ActivitiesTable from "../../Components/Table/ActivitiesTable";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const Activities = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<any>(dayjs(new Date()));
    const fetchData = useCallback(async () => {
        const data = await getActivitiesForDay(new Date(date));
        console.log(data);
        setActivities(data);
        setLoading(false);
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
            {loading ? <CircularProgress /> :
                (
                    <>
                        <Box>
                            <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
                        </Box>
                        <DatePicker value={dayjs(date)} onChange={(date) => setDate(dayjs(date))} />
                        <ActivitiesTable activities={activities} />
                        {createModalOpen && <CreateActivityModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
                    </>
                )}
        </>
    );
};

export default Activities;