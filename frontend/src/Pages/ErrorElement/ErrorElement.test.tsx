import { render, screen } from "@testing-library/react";
import ErrorElement from "./ErrorElement";

describe("ErrorElement component", () => {
  it("renders correctly", () => {
    render(<ErrorElement message="Error message" />);
    const error = screen.getByText("Error");
    const errorMessage = screen.getByText("Error message");
    expect(error).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
  });
});
