import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, LinearProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { LearningResource } from "../../logic/interfaces";
import { calculateTotalPages } from "../../logic/other";
import { getLearningResources } from "../../logic/learningResources";
import CreateLearningResourceModal from "../../Components/ModalComponents/Create/CreateLearningResourceModal";
import LearningResourcesTable from "../../Components/Table/LearningResourcesTable";

const LearningResources = () => {
  const perPage = 10;
  const { learningId } = useParams<{ learningId: string }>();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (pageParam: number) => {
      if (learningId === undefined) {
        return;
      }
      const data = await getLearningResources(+learningId, pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
      setTotalItems(data.count);
      setTotalPages(totalPagesNumber);
      setPage(pageParam);
      setResources(data.results);
      setLoading(false);
    },
    [learningId],
  );
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    fetchData(1);
  };

  const handlePageChange = async (pageParam: number) => {
    if (learningId === undefined) {
      return;
    }
    await fetchData(pageParam);
  };

  useEffect(() => {
    setTotalPages(1);
    setPage(1);
    fetchData(1);
  }, [fetchData]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
        <IconButton onClick={() => setCreateModalOpen(true)}>
          <AddCircleIcon />
        </IconButton>
      </Box>
      {loading ? (
        <LinearProgress />
      ) : (
        <LearningResourcesTable
          resources={resources}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
        />
      )}
      {createModalOpen && learningId && (
        <CreateLearningResourceModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
          learningId={+learningId}
        />
      )}
    </>
  );
};

export default LearningResources;
