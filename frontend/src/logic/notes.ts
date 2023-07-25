import { Note } from "./interfaces";
import { backendRequest } from "./request"

export const getNotes = async (): Promise<Note[]> => {
    const response = await backendRequest("/notes", "GET", true);
    return await response.json();
};