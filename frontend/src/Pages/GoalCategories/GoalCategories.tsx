import { useEffect, useState } from "react";
import { GoalCategory } from "../../logic/interfaces";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, LinearProgress } from "@mui/material";
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
  const fetchData = async (pageParam = 1) => {
    const data = await getGoalCategories(pageParam);
    const totalPagesNumber = calculateTotalPages(data.count, perPage);
    setTotalPages(totalPagesNumber);
    setPage(pageParam);
    setGoalCategories(data.results);
    setTimeout(() => {
      setLoading(false);
    }, 100);
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
        <LinearProgress />
      ) : (
        <>
          <Box>
            <IconButton onClick={() => setCreateModalOpen(true)}>
              <AddCircleIcon />
            </IconButton>
          </Box>
          <GoalCategoriesTable
            goalCategories={goalCategories}
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
      {createModalOpen && (
        <CreateGoalCategoryModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
        />
      )}
    </>
  );
};

export default GoalCategories;
