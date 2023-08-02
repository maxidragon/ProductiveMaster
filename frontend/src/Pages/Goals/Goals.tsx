import { useEffect, useState } from "react";
import GoalsTable from "../../Components/Table/GoalsTable";
import { Goal, GoalCategory } from "../../logic/interfaces";
import { getAllGoals, getGoalsByCategoryId } from "../../logic/goals";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress, Box, IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CreateGoalModal from "../../Components/ModalComponents/CreateGoalModal";
import GoalCategorySelect from "../../Components/Goals/GoalCategorySelect";
import { getGoalCategories } from "../../logic/goalCategories";

const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
    const [selected, setSelected] = useState<number>(0);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        setLoading(true);
        const data = await getAllGoals();
        const categories = await getGoalCategories();
        setGoals(data);
        setGoalCategories(categories);
        setLoading(false);
    };

    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        fetchData();
    };
    const handleGoalCategoryChange = async (event: any) => {
        const id = event.target.value;
        if (id === 0) {
            await fetchData();
            return;
        }
        setSelected(id);
        setLoading(true);
        const data = await getGoalsByCategoryId(id);
        setGoals(data);
        setLoading(false);
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
                    <FormControl fullWidth>
                        <InputLabel id="goal-category-select-label">
                            Goal Category
                        </InputLabel>
                        <Select
                            labelId="goal-category-select-label"
                            id="goal-category-select"
                            value={selected}
                            label="Goal Category"
                            onChange={handleGoalCategoryChange}
                        >
                            <MenuItem key={0} value={0}>
                                All
                            </MenuItem>
                            {goalCategories.map((goalCategory: GoalCategory) => (
                                <MenuItem key={goalCategory.id} value={goalCategory.id}>
                                    {goalCategory.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <GoalsTable goals={goals} />
                </>
            )}
            {createModalOpen && <CreateGoalModal open={createModalOpen} handleClose={handleCloseCreateModal} />}

        </>
    )
};

export default Goals;