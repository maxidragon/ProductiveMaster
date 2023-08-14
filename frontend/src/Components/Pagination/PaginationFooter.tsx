import { TableRow, TableCell, Typography, IconButton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useEffect, useState } from "react";

const PaginationFooter = (props: {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}) => {
  const [isPreviousPageDisabled, setIsPreviousPageDisabled] =
    useState<boolean>(false);
  const [isNextPageDisabled, setIsNextPageDisabled] = useState<boolean>(false);

  useEffect(() => {
    setIsPreviousPageDisabled(props.page === 1);
    setIsNextPageDisabled(props.page === props.totalPages);
  }, [props.page, props.totalPages]);

  const nextPage = () => {
    if (props.page < props.totalPages) {
      props.handlePageChange(props.page + 1);
    }
  };
  const previousPage = () => {
    if (props.page > 1) {
      props.handlePageChange(props.page - 1);
    }
  };

  return (
    <TableRow>
      <TableCell
        colSpan={3}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          borderBottom: "none",
        }}
      >
        <IconButton onClick={previousPage} disabled={isPreviousPageDisabled}>
          <NavigateBeforeIcon />
        </IconButton>
        <Typography>
          Page {props.page} of {props.totalPages}
        </Typography>
        <IconButton onClick={nextPage} disabled={isNextPageDisabled}>
          <NavigateNextIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default PaginationFooter;
