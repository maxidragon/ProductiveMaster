import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { vi } from "vitest";

vi.mock("../../logic/auth", () => ({
  getUserData: () => {
    return {
      id: 1,
      github_profile: "https://github.com",
      gprm_stats: "mockStats",
      gprm_streak: "mockStreak",
      gprm_languages: "mockLanguages",
      wakatime_api_key: "mockKey",
    };
  },
  logout: () => {
    return;
  },
}));

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
