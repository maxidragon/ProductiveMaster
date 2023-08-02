import { useEffect, useState } from "react";
import { getNotes } from "../../logic/notes";
import { Note } from "../../logic/interfaces";
import { Box, CircularProgress, IconButton } from "@mui/material";
import NoteCard from "../../Components/CardComponents/NoteCard";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateNoteModal from "../../Components/ModalComponents/Create/CreateNoteModal";

const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        const data = await getNotes();
        setNotes(data);
        setLoading(false);
    };
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        fetchData();
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            {loading ? (
                <CircularProgress />) : (
                <>
                <Box>
                    <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 10, flexWrap: 'wrap' }}>
                    {notes.map((note: Note) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </Box>
                </>
            )}
            {createModalOpen && <CreateNoteModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
        </>
    );
};

export default Notes;