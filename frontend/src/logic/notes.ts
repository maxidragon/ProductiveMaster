import { Note } from "./interfaces";
import { backendRequest } from "./request"

export const getNotes = async (): Promise<Note[]> => {
    const response = await backendRequest("/notes", "GET", true);
    return await response.json();
};

export const createNote = async (title: string, description: string): Promise<number> => {
    const response = await backendRequest("/notes/", "POST", true, { title, description });
    return response.status;
};