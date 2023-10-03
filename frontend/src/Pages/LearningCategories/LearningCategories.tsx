import { useEffect, useState } from "react";
import { LearningCategory } from "../../logic/interfaces";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, LinearProgress } from "@mui/material";
import CreateLearningCategoryModal from "../../Components/ModalComponents/Create/CreateLearningCategoryModal";
import { calculateTotalPages } from "../../logic/other";
import LearningCategoriesTable from "../../Components/Table/LearningCategoriesTable";
import { getLearningCategories } from "../../logic/learningCategories";

const LearningCategories = () => {
  const perPage = 10;
  const [learningCategories, setLearningCategories] = useState<
    LearningCategory[]
  >([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const fetchData = async (pageParam = 1) => {
    const data = await getLearningCategories(pageParam);
    const totalPagesNumber = calculateTotalPages(data.count, perPage);
    setTotalPages(totalPagesNumber);
    setTotalItems(data.count);
    setPage(pageParam);
    setLearningCategories(data.results);
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
          <LearningCategoriesTable
            learningCategories={learningCategories}
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            handlePageChange={handlePageChange}
          />
        </>
      )}
      {createModalOpen && (
        <CreateLearningCategoryModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
        />
      )}
    </>
  );
};

export default LearningCategories;
