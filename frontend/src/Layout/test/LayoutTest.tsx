import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "../Layout";
import Dashboard from "../../Pages/Dashboard/Dashboard";

describe("Layout component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Layout children={<Dashboard />} />
      </MemoryRouter>,
    );
    const dashboard = screen.getByText("Dashboard");
    expect(dashboard).toBeInTheDocument();
    const projects = screen.getByText("Projects");
    expect(projects).toBeInTheDocument();
    const tasks = screen.getByText("Tasks");
    expect(tasks).toBeInTheDocument();
    const activities = screen.getByText("Activities");
    expect(activities).toBeInTheDocument();
    const notes = screen.getByText("Notes");
    expect(notes).toBeInTheDocument();
    const goals = screen.getByText("Goals");
    expect(goals).toBeInTheDocument();
    const settings = screen.getByText("Settings");
    expect(settings).toBeInTheDocument();
    const footer = screen.getByText("ProductiveMaster");
    expect(footer).toBeInTheDocument();
  });
});
