import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import TaskRow from "../TaskRow";

const mockTask = {
  id: 1,
  title: "Mock Task",
  description: "Mock Description",
  status: "IN_PROGRESS",
  high_priority: false,
  issue: "https://github.com",
  pull_request: "https://github.com",
  project: {
    id: 1,
    title: "Mock Project",
    description: "Mock Description",
    status: "IN_PROGRESS",
    github: "https://github.com",
  },
};

describe("TaskRow component", () => {
  it("renders correctly for single project", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <TaskRow
              task={mockTask}
              multipleProjects={false}
              handleStatusUpdate={(status) => {
                status = "IN_PROGRESS";
                return status;
              }}
            />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Task");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const status = screen.getByText("In progress");
    expect(status).toBeInTheDocument();
  });
  it("renders correctly for multiple projects", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <TaskRow
              task={mockTask}
              multipleProjects={true}
              handleStatusUpdate={(status) => {
                status = "IN_PROGRESS";
                return status;
              }}
            />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Task");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const status = screen.getByText("In progress");
    expect(status).toBeInTheDocument();
    const projectName = screen.getByText("Mock Project");
    expect(projectName).toBeInTheDocument();
  });

  it("renders correctly for single project with high priority", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <TaskRow
              task={{ ...mockTask, high_priority: true }}
              multipleProjects={false}
              handleStatusUpdate={(status) => {
                status = "IN_PROGRESS";
                return status;
              }}
            />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Task");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const status = screen.getByText("In progress");
    expect(status).toBeInTheDocument();
    const priority = screen.getByText("High priority");
    expect(priority).toBeInTheDocument();
  });
});
