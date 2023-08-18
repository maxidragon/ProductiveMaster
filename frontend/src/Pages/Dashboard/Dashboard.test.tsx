import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

describe("Dashboard component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    const githubStats = screen.getByText("Github stats");
    const time = screen.getByText("Time");
    const highPriorityTasks = screen.getByText("High priority tasks");
    expect(githubStats).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(highPriorityTasks).toBeInTheDocument();
  });
});
