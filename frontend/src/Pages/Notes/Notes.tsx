import { useEffect, useState } from "react";
import { getNotes, searchNotes } from "../../logic/notes";
import { Note } from "../../logic/interfaces";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import NoteCard from "../../Components/CardComponents/NoteCard";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateNoteModal from "../../Components/ModalComponents/Create/CreateNoteModal";

const Notes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
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

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value === "") {
            fetchData();
            return;
        }
        const filteredNotes = await searchNotes(event.target.value);
        setNotes(filteredNotes);
    };
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
                <TextField sx={{ width: '100%' }} label="Search" variant="outlined" value={search} onChange={handleSearch} />
                <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
            </Box>
            {loading ? (
                <CircularProgress />) : (
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, flexWrap: 'wrap' }}>
                    {notes.map((note: Note) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </Box>
            )}
            {createModalOpen && <CreateNoteModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
        </>
    );
};

export default Notes;