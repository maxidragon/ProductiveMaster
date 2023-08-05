import { Note } from "./interfaces";
import { backendRequest } from "./request"

export const getNotes = async (): Promise<Note[]> => {
    const response = await backendRequest("notes/", "GET", true);
    return await response.json();
};

export const createNote = async (title: string, description: string): Promise<number> => {
    const response = await backendRequest("notes/", "POST", true, { title, description });
    return response.status;
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

export const searchNotes = async (query: string): Promise<Note[]> => {
    const response = await backendRequest(`notes/search/${query}`, "GET", true);
    return await response.json();
}