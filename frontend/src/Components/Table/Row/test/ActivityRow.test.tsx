import { render, screen } from "@testing-library/react";
import ActivityRow from "../ActivityRow";
import { Table, TableBody } from "@mui/material";

const mockActivity = {
  id: 1,
  title: "Mock Activity",
  description: "Mock Description",
  start_time: new Date(),
  end_time: new Date(),
};

describe("ActivityRow component", () => {
  it("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <ActivityRow activity={mockActivity} />
        </TableBody>
      </Table>,
    );

    const title = screen.getByText("Mock Activity");
    expect(title).toBeInTheDocument();
    const description = screen.getByText("Mock Description");
    expect(description).toBeInTheDocument();
  });
});
