import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";

import DocumentRow from "../DocumentRow";

const mockDocument = {
  id: 1,
  title: "Test",
  project: 1,
  owner: 1,
  created_at: new Date("2021-10-17T12:00:00Z"),
  updated_at: new Date("2021-10-17T12:00:00Z"),
  url: "https://test.com",
};

describe("DocumentRow component", () => {
  it("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <DocumentRow document={mockDocument} />
        </TableBody>
      </Table>,
    );

    const title = screen.getByText("Test");
    expect(title).toBeInTheDocument();
  });
});
