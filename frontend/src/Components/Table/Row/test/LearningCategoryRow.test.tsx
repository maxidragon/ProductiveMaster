import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import LearningCategoryRow from "../LearningCategoryRow";

const mockLearningCategory = {
  id: 1,
  name: "Mock Category",
  created_at: new Date("2021-10-10T10:10:10.000Z"),
  updated_at: new Date("2021-10-10T10:10:10.000Z"),
};

describe("LearningCategoryRow", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <LearningCategoryRow learningCategory={mockLearningCategory} />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Category");
    expect(title).toBeInTheDocument();
  });
});
