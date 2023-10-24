import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, LinearProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Document as DocumentInterface } from "../../logic/interfaces";
import { calculateTotalPages } from "../../logic/other";
import { getDocumentsForProject } from "../../logic/documents";
import CreateDocumentModal from "../../Components/ModalComponents/Create/CreateDocumentModal";
import DocumentsTable from "../../Components/Table/DocumentsTable";
import { isProjectOwner as isProjectOwnerFetch } from "../../logic/projectParticipants";

const DocumentsForProject = () => {
  const perPage = 10;
  const { projectId } = useParams<{ projectId: string }>();
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (pageParam: number) => {
      if (projectId === undefined) {
        return;
      }
      const data = await getDocumentsForProject(+projectId, pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
      setTotalItems(data.count);
      setTotalPages(totalPagesNumber);
      setPage(pageParam);
      setDocuments(data.results);
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

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      const isOwner = await isProjectOwnerFetch(+projectId);
      setIsProjectOwner(isOwner["is_owner"]);
    };
    fetchData();
  }, [projectId]);

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
        <DocumentsTable
          documents={documents}
          page={page}
          isProjectOwner={isProjectOwner}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
        />
      )}
      {createModalOpen && projectId && (
        <CreateDocumentModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
          projectId={+projectId}
        />
      )}
    </>
  );
};

export default DocumentsForProject;
