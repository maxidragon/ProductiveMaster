import { Note } from "./interfaces";
import { backendRequest } from "./request";

export const getNotes = async (page = 1) => {
  const response = await backendRequest(`notes/?page=${page}`, "GET", true);
  return await response.json();
};

export const createNote = async (title: string, description: string) => {
  const response = await backendRequest("notes/", "POST", true, {
    title,
    description,
  });
  return {
    status: response.status,
    data: await response.json(),
  };
};

export const updateNoteById = async (note: Note): Promise<number> => {
  const response = await backendRequest(`notes/${note.id}/`, "PUT", true, note);
  return response.status;
};

export const deleteNoteById = async (id: number): Promise<number> => {
  const response = await backendRequest(`notes/${id}/`, "DELETE", true);
  return response.status;
};

export const getNoteById = async (id: number): Promise<Note> => {
  const response = await backendRequest(`notes/${id}/`, "GET", true);
  return await response.json();
};

export const searchNotes = async (query: string, page = 1) => {
  const response = await backendRequest(
    `notes/search/${query}/?page=${page}`,
    "GET",
    true,
  );
  return await response.json();
};
