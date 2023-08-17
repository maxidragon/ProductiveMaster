import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NoteCard from "./NoteCard";

describe("NoteCard component", () => {
  const mockNote = {
    id: 1,
    title: "Test Note",
    description: "This is a test note description.",
  };

  it("should render NoteCard correctly with note data", () => {
    render(
      <MemoryRouter>
        <NoteCard note={mockNote} />
      </MemoryRouter>,
    );
    const titleElement = screen.getByText(mockNote.title);
    expect(titleElement).toBeInTheDocument();
    const descriptionElement = screen.getByText(
      mockNote.description.substring(0, 200) + "...",
    );
    expect(descriptionElement).toBeInTheDocument();
  });
});
