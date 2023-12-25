import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NoteCard from "./NoteCard";

describe("NoteCard component", () => {
  const mockNote = {
    id: 1,
    title: "Test Note",
    description: "This is a test note description over 30 characters long.",
  };

  const mockNote2 = {
    id: 2,
    title: "Test Note 2",
    description: "Under 30 characters long.",
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
      mockNote.description.substring(0, 30) + "...",
    );
    expect(descriptionElement).toBeInTheDocument();
  });

  it("should render NoteCard correctly with note data under 30 characters", () => {
    render(
      <MemoryRouter>
        <NoteCard note={mockNote2} />
      </MemoryRouter>,
    );
    const titleElement = screen.getByText(mockNote2.title);
    expect(titleElement).toBeInTheDocument();
    const descriptionElement = screen.getByText(mockNote2.description);
    expect(descriptionElement).toBeInTheDocument();
  });
});
