import { useCallback, useEffect, useState } from "react";
import GoalsTable from "../../Components/Table/GoalsTable";
import { Goal, GoalCategory } from "../../logic/interfaces";
import { getAllGoals, getGoalsByCategoryId } from "../../logic/goals";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CategoryIcon from "@mui/icons-material/Category";
import {
  Box,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  LinearProgress,
} from "@mui/material";
import CreateGoalModal from "../../Components/ModalComponents/Create/CreateGoalModal";
import { getAllGoalCategories } from "../../logic/goalCategories";
import { Link } from "react-router-dom";
import { calculateTotalPages } from "../../logic/other";

const Goals = () => {
  const perPage = 10;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalCategories, setGoalCategories] = useState<GoalCategory[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(async (category: number, pageParam = 1) => {
    const categories = await getAllGoalCategories();
    if (category === 0) {
      const data = await getAllGoals(pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
      setTotalPages(totalPagesNumber);
      setPage(pageParam);
      setGoals(data.results);
    } else {
      const data = await getGoalsByCategoryId(category, pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
      setTotalPages(totalPagesNumber);
      setPage(pageParam);
      setGoals(data.results);
    }
    setGoalCategories(categories);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setPage(1);
    setTotalPages(1);
    fetchData(0, 1);
  };
  const handleGoalCategoryChange = async (event: SelectChangeEvent<number>) => {
    const id = event.target.value;
    setSelected(+id);
    fetchData(+id, 1);
  };
  const handlePageChange = (pageParam: number) => {
    setPage(pageParam);
    fetchData(selected, pageParam);
  };

  useEffect(() => {
    setTotalPages(1);
    setPage(1);
    fetchData(selected, 1);
  }, [fetchData, selected]);
  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
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
            <IconButton onClick={() => setCreateModalOpen(true)}>
              <AddCircleIcon />
            </IconButton>
            <IconButton component={Link} to="/goals/categories">
              <CategoryIcon />
            </IconButton>
          </Box>

          <GoalsTable
            goals={goals}
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
      {createModalOpen && (
        <CreateGoalModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
        />
      )}
    </>
  );
};

export default Goals;
