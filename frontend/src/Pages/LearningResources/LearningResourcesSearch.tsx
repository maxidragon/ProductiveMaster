import { useState, useCallback, useEffect } from "react";
import { LearningResourceWithCategory } from "../../logic/interfaces";
import { LinearProgress, TextField, Box } from "@mui/material";
import { calculateTotalPages } from "../../logic/other";
import {
  getAllLearningResources,
  searchLearningResources,
} from "../../logic/learningResources";
import LearningResourcesWithCategoryTable from "../../Components/Table/LearningResourcesWithCategoryTable";

const LearningResourcesSearch = () => {
  const perPage = 10;
  const [learningResources, setLearningResources] = useState<
    LearningResourceWithCategory[]
  >([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (pageParam = 1) => {
    const data = await getAllLearningResources(pageParam);
    const totalPagesNumber = calculateTotalPages(data.count, perPage);
    setTotalPages(totalPagesNumber);
    setTotalItems(data.count);
    setPage(pageParam);
    setLearningResources(data.results);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    setTotalPages(1);
    setPage(1);
    fetchData(1);
  }, [fetchData]);

  const handlePageChange = async (pageParam: number) => {
    if (search !== "") {
      const filteredResources = await searchLearningResources(
        search,
        pageParam,
      );
      setLearningResources(filteredResources.results);
      setPage(pageParam);
      const totalPagesNumber = calculateTotalPages(
        filteredResources.count,
        perPage,
      );
      setTotalPages(totalPagesNumber);
      setTotalItems(filteredResources.count);
    } else {
      await fetchData(pageParam);
    }
  };
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    if (event.target.value === "") {
      fetchData(page);
      return;
    }
    const filteredResources = await searchLearningResources(event.target.value);
    setLearningResources(filteredResources.results);
    setPage(1);
    const totalPagesNumber = calculateTotalPages(
      filteredResources.count,
      perPage,
    );
    setTotalPages(totalPagesNumber);
    setTotalItems(filteredResources.count);
  };
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
        <TextField
          sx={{ width: "50%" }}
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
        />
      </Box>
      {loading ? (
        <LinearProgress />
      ) : (
        <LearningResourcesWithCategoryTable
          resources={learningResources}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default LearningResourcesSearch;
