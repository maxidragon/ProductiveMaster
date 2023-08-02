import { useEffect, useState } from "react";
import { GoalCategory } from "../../logic/interfaces";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress, Box, IconButton } from "@mui/material";
import { getGoalCategories } from "../../logic/goalCategories";
import CreateGoalCategoryModal from "../../Components/ModalComponents/Create/CreateGoalCategoryModal";
import GoalCategoriesTable from "../../Components/Table/GoalCategoriesTable";

const GoalCategories = () => {
    const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        setLoading(true);
        const data = await getGoalCategories();
        setGoalCategories(data);
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
                    <GoalCategoriesTable goalCategories={goalCategories} />
                </>
            )}
            {createModalOpen && <CreateGoalCategoryModal open={createModalOpen} handleClose={handleCloseCreateModal} />}

        </>
    )
};

export default GoalCategories;