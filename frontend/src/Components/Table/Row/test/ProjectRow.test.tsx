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
};

describe("ProjectRow component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <ProjectRow project={mockProject} />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Project");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const status = screen.getByText("IN_PROGRESS");
    expect(status).toBeInTheDocument();
  });
});
