import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Navbar";

describe("Navbar component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Navbar />
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
  });
});
