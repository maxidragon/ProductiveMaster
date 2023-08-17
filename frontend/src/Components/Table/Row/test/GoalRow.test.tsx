import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import GoalRow from "../GoalRow";

const mockGoal = {
  id: 1,
  title: "Mock Goal",
  description: "Mock Description",
  deadline: new Date(),
  goal_category: {
    id: 1,
    title: "Mock Goal Category",
  },
  is_achieved: false,
};

describe("GoalRow component", () => {
  it("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <GoalRow goal={mockGoal} />
        </TableBody>
      </Table>,
    );

    const title = screen.getByText("Mock Goal");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
  });
  it("renders correctly when goal is achieved", () => {
    const mockAchievedGoal = {
      id: 1,
      title: "Mock Goal",
      description: "Mock Description",
      deadline: new Date("2021-10-10"),
      goal_category: {
        id: 1,
        title: "Mock Goal Category",
      },
      is_achieved: true,
    };
    render(
      <Table>
        <TableBody>
          <GoalRow goal={mockAchievedGoal} />
        </TableBody>
      </Table>,
    );

    const title = screen.getByText("Mock Goal");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const achieved = screen.getByText("Achieved");
    expect(achieved).toBeInTheDocument();
  });
  it("renders correctly when goal is not achieved", () => {
    const mockAchievedGoal = {
      id: 1,
      title: "Mock Goal",
      description: "Mock Description",
      deadline: new Date("2021-10-10"),
      goal_category: {
        id: 1,
        title: "Mock Goal Category",
      },
      is_achieved: false,
    };
    render(
      <Table>
        <TableBody>
          <GoalRow goal={mockAchievedGoal} />
        </TableBody>
      </Table>,
    );

    const title = screen.getByText("Mock Goal");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
    const achieved = screen.getByText("Failed");
    expect(achieved).toBeInTheDocument();
  });
});
