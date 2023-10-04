import { render, screen } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";

import TimezoneRow from "../TimezoneRow";

const mockTimezone = {
  id: 1,
  display_name: "UTC",
  name: "UTC",
};

describe("TimezoneRow component", () => {
  it("renders correctly", () => {
    render(
      <Table>
        <TableBody>
          <TimezoneRow timezone={mockTimezone} />
        </TableBody>
      </Table>,
    );

    const displayName = screen.getByText("UTC");
    expect(displayName).toBeInTheDocument();
  });
});
