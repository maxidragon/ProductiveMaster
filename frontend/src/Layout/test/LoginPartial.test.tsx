import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPartial from "../LoginPartial";

jest.mock("../../logic/auth", () => ({
  getUsername: () => "mockUser",
  logout: () => {
    return;
  },
}));
describe("LoginPartial component", () => {
  it("renders correctly when user is logged in", () => {
    render(
      <MemoryRouter>
        <LoginPartial userLoggedIn={true} />
      </MemoryRouter>,
    );

    const username = screen.getByText("Hello mockUser");
    expect(username).toBeInTheDocument();
    const logoutButton = screen.getByRole("button");
    expect(logoutButton).toBeInTheDocument();
  });

  it("renders correctly when user is not logged in", () => {
    render(
      <MemoryRouter>
        <LoginPartial userLoggedIn={false} />
      </MemoryRouter>,
    );

    const username = screen.queryByText("Hello mockUser");
    expect(username).not.toBeInTheDocument();
    const logoutButton = screen.queryByRole("button");
    expect(logoutButton).not.toBeInTheDocument();
  });
});
