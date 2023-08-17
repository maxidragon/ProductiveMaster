import { render, screen, fireEvent } from "@testing-library/react";
import PaginationFooter from "./PaginationFooter";

describe("PaginationFooter component", () => {
  const mockHandlePageChange = jest.fn();

  afterEach(() => {
    mockHandlePageChange.mockClear();
  });

  it("should render PaginationFooter correctly", () => {
    render(
      <PaginationFooter
        page={1}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
      />,
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
      <PaginationFooter
        page={1}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
      />,
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
      <PaginationFooter
        page={5}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
      />,
    );

    const previousButton = screen.getByRole("button", {
      name: "previousPageButton",
    });
    const nextButton = screen.getByRole("button", { name: "nextPageButton" });

    expect(previousButton).not.toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("should call handlePageChange with the correct page number when next button is clicked", () => {
    render(
      <PaginationFooter
        page={3}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
      />,
    );

    const nextButton = screen.getByRole("button", { name: "nextPageButton" });
    fireEvent.click(nextButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(4);
  });

  it("should call handlePageChange with the correct page number when previous button is clicked", () => {
    render(
      <PaginationFooter
        page={3}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
      />,
    );

    const previousButton = screen.getByRole("button", {
      name: "previousPageButton",
    });
    fireEvent.click(previousButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(2);
  });
});
