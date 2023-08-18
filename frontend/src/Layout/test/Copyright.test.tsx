import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Copyright from "../Copyright";

describe("Copyright component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Copyright />
      </MemoryRouter>,
    );
    const footer = screen.getByText("ProductiveMaster");
    expect(footer).toBeInTheDocument();
  });
});
