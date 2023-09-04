import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import ProjectRow from "../ProjectRow";

const mockProject = {
  id: 1,
  title: "Mock Project",
  description: "Mock Description",
  status: "IN_PROGRESS",
  github: "https://github.com",
  num_tasks_todo: 1,
  num_tasks_in_progress: 1,
  num_tasks_completed: 0,
  created_at: new Date("2021-10-10T10:10:10.000Z"),
  updated_at: new Date("2021-10-10T10:10:10.000Z"),
};

describe("ProjectRow component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <ProjectRow
              project={mockProject}
              handleStatusUpdate={(status) => {
                status = "IN_PROGRESS";
                return status;
              }}
            />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Project");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const status = screen.getByText("In progress");
    expect(status).toBeInTheDocument();
  });
});
