import { useEffect, useState } from "react";
import { getNotes } from "../../logic/notes";
import { Note } from "../../logic/interfaces";
import { Box, CircularProgress } from "@mui/material";
import NoteCard from "../../Components/CardComponents/NoteCard";

const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getNotes();
            setNotes(data);
            setLoading(false);
        };
        fetchData();
    }, []);
    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 10, flexWrap: 'wrap' }}>
                    {notes.map((note: Note) => (
                        <NoteCard note={note} />
                    ))}
                </Box>
            )}
        </>
    );
};

export default Notes;