import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../Register/Register";

describe("Register component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    const register = screen.getByText("Sign up");
    expect(register).toBeInTheDocument();
  });
});
