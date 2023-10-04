import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import LearningRow from "../LearningRow";

const mockLearning = {
  id: 1,
  title: "Mock Learning",
  description: "Mock Description",
  status: "IN_PROGRESS",
  created_at: new Date("2021-10-10T10:10:10.000Z"),
  updated_at: new Date("2021-10-10T10:10:10.000Z"),
  learning_category: {
    id: 1,
    name: "Mock Category",
    created_at: new Date("2021-10-10T10:10:10.000Z"),
    updated_at: new Date("2021-10-10T10:10:10.000Z"),
  },
  owner: 1,
};

describe("LearningRow", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <LearningRow
              learning={mockLearning}
              handleStatusUpdate={(status) => {
                status = "IN_PROGRESS";
                return status;
              }}
            />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Learning");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const status = screen.getByText("In progress");
    expect(status).toBeInTheDocument();
  });
});
