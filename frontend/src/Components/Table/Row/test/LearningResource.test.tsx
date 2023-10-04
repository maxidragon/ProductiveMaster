import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import LearningResourceRow from "../LearningResourceRow";

const mockLearningResource = {
  id: 1,
  title: "Mock Resource",
  url: "https://github.com",
  created_at: new Date("2021-10-10T10:10:10.000Z"),
  updated_at: new Date("2021-10-10T10:10:10.000Z"),
  learning: 1,
  owner: 1,
};

describe("LearningResourceRow", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Table>
          <TableBody>
            <LearningResourceRow resource={mockLearningResource} />
          </TableBody>
        </Table>
      </MemoryRouter>,
    );

    const title = screen.getByText("Mock Resource");
    expect(title).toBeInTheDocument();
  });
});
