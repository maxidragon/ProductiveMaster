import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login/Login";

describe("Login component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const login = screen.getByText("Sign in");
    expect(login).toBeInTheDocument();
  });
});
