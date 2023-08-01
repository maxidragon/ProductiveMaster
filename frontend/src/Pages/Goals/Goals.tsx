import { useEffect, useState } from "react";
import GoalsTable from "../../Components/Table/GoalsTable";
import { Goal } from "../../logic/interfaces";
import { getAllGoals } from "../../logic/goals";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress, Box, IconButton } from "@mui/material";
import CreateGoalModal from "../../Components/ModalComponents/CreateGoalModal";

const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        setLoading(true);
        const data = await getAllGoals();
        setGoals(data);
        setLoading(false);
    };

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <>
                    <Box>
                        <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
                    </Box>
                    <GoalsTable goals={goals} />
                </>
            )}
            {createModalOpen && <CreateGoalModal open={createModalOpen} handleClose={handleCloseCreateModal} />}

        </>
    )
};

export default Goals;