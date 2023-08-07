import { useEffect, useState } from "react";
import { GoalCategory } from "../../logic/interfaces";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress, Box, IconButton } from "@mui/material";
import { getGoalCategories } from "../../logic/goalCategories";
import CreateGoalCategoryModal from "../../Components/ModalComponents/Create/CreateGoalCategoryModal";
import GoalCategoriesTable from "../../Components/Table/GoalCategoriesTable";
import { calculateTotalPages } from "../../logic/other";

const GoalCategories = () => {
    const perPage = 10;
    const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const fetchData = async (pageParam: number = 1) => {
        setLoading(true);
        const data = await getGoalCategories(pageParam);
        console.log(data);
        const totalPagesNumber = calculateTotalPages(data.count, perPage);
        setTotalPages(totalPagesNumber);
        setPage(pageParam);
        setGoalCategories(data.results);
        setLoading(false);
    };

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        fetchData();
    };
    const handlePageChange = async (pageParam: number) => {
        setPage(pageParam);
        fetchData(pageParam);
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
                    <GoalCategoriesTable goalCategories={goalCategories} page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
                </>
            )}
            {createModalOpen && <CreateGoalCategoryModal open={createModalOpen} handleClose={handleCloseCreateModal} />}

        </>
    )
};

export default GoalCategories;