import { useState, useCallback, useEffect } from "react";
import { LearningType } from "../../logic/interfaces";
import { searchTasks } from "../../logic/tasks";
import {
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { calculateTotalPages } from "../../logic/other";
import { getLearningsByStatus, searchLearnings } from "../../logic/learning";
import LearningsTable from "../../Components/Table/LearningsTable";
import CreateLearningModal from "../../Components/ModalComponents/Create/CreateLearningModal";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Link } from "react-router-dom";

const Learning = () => {
  const perPage = 10;
  const [learnings, setLearnings] = useState<LearningType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("IN_PROGRESS");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (pageParam: number, statusParam?: string) => {
      if (statusParam === undefined || statusParam === "") {
        return;
      }
      const data = await getLearningsByStatus(statusParam, pageParam);
      const totalPagesNumber = calculateTotalPages(data.count, perPage);
      setTotalPages(totalPagesNumber);
      setTotalItems(data.count);
      setPage(pageParam);
      setLearnings(data.results);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    },
    [],
  );

  useEffect(() => {
    setTotalPages(1);
    setPage(1);
    fetchData(1, status);
  }, [status, fetchData]);

  const handlePageChange = async (pageParam: number) => {
    if (search !== "") {
      const filteredLearnings = await searchLearnings(
        search,
        status,
        pageParam,
      );
      setLearnings(filteredLearnings.results);
      setPage(pageParam);
      const totalPagesNumber = calculateTotalPages(
        filteredLearnings.count,
        perPage,
      );
      setTotalPages(totalPagesNumber);
      setTotalItems(filteredLearnings.count);
    } else {
      await fetchData(pageParam, status);
    }
  };
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    if (event.target.value === "") {
      fetchData(page, status);
      return;
    }
    const filteredLearnings = await searchTasks(event.target.value, status);
    setLearnings(filteredLearnings.results);
    setPage(1);
    const totalPagesNumber = calculateTotalPages(
      filteredLearnings.count,
      perPage,
    );
    setTotalPages(totalPagesNumber);
    setTotalItems(filteredLearnings.count);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setPage(1);
    setTotalPages(1);
    fetchData(1, status);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
        <FormControl sx={{ width: "50%", mr: 2 }}>
          <InputLabel id="status">Status</InputLabel>
          <Select
            labelId="status"
            label="Status"
            required
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <MenuItem value={"TO_LEARN"}>To learn</MenuItem>
            <MenuItem value={"IN_PROGRESS"}>In progress</MenuItem>
            <MenuItem value={"DONE"}>Done</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={{ width: "50%" }}
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
        />
        <IconButton onClick={() => setCreateModalOpen(true)}>
          <AddCircleIcon />
        </IconButton>
        <IconButton component={Link} to="/learning/categories">
          <CategoryIcon />
        </IconButton>
      </Box>
      {loading ? (
        <LinearProgress />
      ) : (
        <LearningsTable
          learnings={learnings}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
          status={status}
          fetchData={fetchData}
        />
      )}
      {createModalOpen && (
        <CreateLearningModal
          open={createModalOpen}
          handleClose={handleCloseCreateModal}
        />
      )}
    </>
  );
};

export default Learning;
