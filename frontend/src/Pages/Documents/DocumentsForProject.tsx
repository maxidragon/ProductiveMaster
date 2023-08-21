import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, LinearProgress } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Document as DocumentInterface } from "../../logic/interfaces";
import { calculateTotalPages } from "../../logic/other";
import { getDocumentsForProject } from "../../logic/documents";
import CreateDocumentModal from "../../Components/ModalComponents/Create/CreateDocumentModal";
import DocumentsTable from "../../Components/Table/DocumentsTable";

const DocumentsForProject = () => {
  const perPage = 10;
  const { projectId } = useParams<{ projectId: string }>();
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (pageParam: number) => {
      if (projectId === undefined) {
        return;
      }
      const data = await getDocumentsForProject(+projectId, pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
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
          totalPages={totalPages}
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
