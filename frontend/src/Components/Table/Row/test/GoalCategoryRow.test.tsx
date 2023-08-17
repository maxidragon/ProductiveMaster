import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import GoalCategoryRow from "../GoalCategoryRow";

const mockGoalCategory = {
  id: 1,
  title: "Mock Goal Category",
};

describe("GoalCategoryRow component", () => {
  it("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <GoalCategoryRow goalCategory={mockGoalCategory} />
        </TableBody>
      </Table>,
    );

    const title = screen.getByText("Mock Goal Category");
    expect(title).toBeInTheDocument();
  });
});
