import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import PaginationFooter from "./PaginationFooter";
import { Table, TableFooter } from "@mui/material";

describe("PaginationFooter component", () => {
  const mockHandlePageChange = vi.fn();

  afterEach(() => {
    mockHandlePageChange.mockClear();
  });

  it("should render PaginationFooter correctly", () => {
    render(
      <Table>
        <TableFooter>
          <PaginationFooter
            page={1}
            totalPages={5}
            totalItems={10}
            handlePageChange={mockHandlePageChange}
          />
        </TableFooter>
      </Table>,
    );

    const pageInfo = screen.getByText("Page 1 of 5");
    expect(pageInfo).toBeInTheDocument();

    const previousButton = screen.getByRole("button", {
      name: "previousPageButton",
    });
    const nextButton = screen.getByRole("button", { name: "nextPageButton" });

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("should disable the previous button on the first page", () => {
    render(
      <Table>
        <TableFooter>
          <PaginationFooter
            page={1}
            totalPages={5}
            totalItems={10}
            handlePageChange={mockHandlePageChange}
          />
        </TableFooter>
      </Table>,
    );

    const previousButton = screen.getByRole("button", {
      name: "previousPageButton",
    });
    const nextButton = screen.getByRole("button", { name: "nextPageButton" });

    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it("should disable the next button on the last page", () => {
    render(
      <Table>
        <TableFooter>
          <PaginationFooter
            page={1}
            totalPages={5}
            totalItems={10}
            handlePageChange={mockHandlePageChange}
          />
        </TableFooter>
      </Table>,
    );

    const previousButton = screen.getByRole("button", {
      name: "previousPageButton",
    });
    const nextButton = screen.getByRole("button", { name: "nextPageButton" });

    expect(nextButton).not.toBeDisabled();
    expect(previousButton).toBeDisabled();
  });

  it("should call handlePageChange with the correct page number when next button is clicked", () => {
    render(
      <Table>
        <TableFooter>
          <PaginationFooter
            page={1}
            totalPages={5}
            totalItems={10}
            handlePageChange={mockHandlePageChange}
          />
        </TableFooter>
      </Table>,
    );

    const nextButton = screen.getByRole("button", { name: "nextPageButton" });
    fireEvent.click(nextButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(2);
  });

  it("should call handlePageChange with the correct page number when previous button is clicked", () => {
    render(
      <Table>
        <TableFooter>
          <PaginationFooter
            page={2}
            totalPages={5}
            totalItems={10}
            handlePageChange={mockHandlePageChange}
          />
        </TableFooter>
      </Table>,
    );

    const previousButton = screen.getByRole("button", {
      name: "previousPageButton",
    });
    fireEvent.click(previousButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(1);
  });

  it("should display the correct total items", () => {
    render(
      <Table>
        <TableFooter>
          <PaginationFooter
            page={1}
            totalPages={5}
            totalItems={10}
            handlePageChange={mockHandlePageChange}
          />
        </TableFooter>
      </Table>,
    );

    const totalItems = screen.getByText("Total items: 10");
    expect(totalItems).toBeInTheDocument();
  });
});
