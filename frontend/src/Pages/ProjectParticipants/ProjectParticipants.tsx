import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, LinearProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ProjectParticipant } from "../../logic/interfaces";
import { calculateTotalPages } from "../../logic/other";
import { getProjectParticipants } from "../../logic/projectParticipants";
import ProjectParticipantsTable from "../../Components/Table/ProjectParticipantsTable";
import AddProjectParticipantModal from "../../Components/ModalComponents/Create/AddProjectParticipantModal";

const ProjectParticipants = () => {
  const perPage = 10;
  const { projectId } = useParams<{ projectId: string }>();
  const [particiants, setParticipants] = useState<ProjectParticipant[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (pageParam: number) => {
      if (projectId === undefined) {
        return;
      }
      const data = await getProjectParticipants(+projectId, pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
      setTotalItems(data.count);
      setTotalPages(totalPagesNumber);
      setPage(pageParam);
      setParticipants(data.results);
      setIsProjectOwner(data.is_owner);
      setLoading(false);
    },
    [projectId],
  );
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    fetchData(1);
  };

  const handlePageChange = async (pageParam: number) => {
    if (projectId === undefined) {
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
      {isProjectOwner && (
        <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
          <IconButton onClick={() => setCreateModalOpen(true)}>
            <AddCircleIcon />
          </IconButton>
        </Box>
      )}
      {loading ? (
        <LinearProgress />
      ) : (
        <ProjectParticipantsTable
          users={particiants}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
          isProjectOwner={isProjectOwner}
        />
      )}
      {createModalOpen && projectId && (
        <AddProjectParticipantModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
          projectId={+projectId}
        />
      )}
    </>
  );
};

export default ProjectParticipants;
