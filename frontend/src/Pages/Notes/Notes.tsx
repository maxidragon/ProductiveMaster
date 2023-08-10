import { useEffect, useState } from "react";
import { getNotes, searchNotes } from "../../logic/notes";
import { Note } from "../../logic/interfaces";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import NoteCard from "../../Components/CardComponents/NoteCard";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateNoteModal from "../../Components/ModalComponents/Create/CreateNoteModal";
import { calculateTotalPages } from "../../logic/other";
import PaginationFooter from "../../Components/Pagination/PaginationFooter";

const Notes = () => {
    const perPage = 12;
    const [notes, setNotes] = useState<Note[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const fetchData = async (pageParam: number = 1) => {
        const data = await getNotes(pageParam);
        const totalPages = calculateTotalPages(data.count, perPage);
        setTotalPages(totalPages);
        setPage(pageParam);
        setNotes(data.results);
        setLoading(false);
    };
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        setSearch("");
        fetchData();
    };
    const handlePageChange = async (pageParam: number) => {
        if (search === "") {
            await fetchData(pageParam);
        } else {
            const filteredNotes = await searchNotes(search, pageParam);
            setNotes(filteredNotes.results);
            setPage(pageParam);
            const totalPages = calculateTotalPages(filteredNotes.count, perPage);
            setTotalPages(totalPages);
        }
    };

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (event.target.value === "") {
            fetchData();
            return;
        }
        const filteredNotes = await searchNotes(event.target.value, 1);
        setNotes(filteredNotes.results);
        const totalPages = calculateTotalPages(filteredNotes.count, perPage);
        setTotalPages(totalPages);
        setPage(1);
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
                <TextField sx={{ width: '100%' }} label="Search" variant="outlined" value={search} onChange={handleSearch} />
                <IconButton onClick={() => setCreateModalOpen(true)}><AddCircleIcon /></IconButton>
            </Box>
            {loading ? (
                <CircularProgress />) : (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 5, flexWrap: 'wrap' }}>
                        {notes.map((note: Note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </Box>
                    {notes.length > 0 && <PaginationFooter page={page} totalPages={totalPages} handlePageChange={handlePageChange} />}
                </>
            )}
            {createModalOpen && <CreateNoteModal open={createModalOpen} handleClose={handleCloseCreateModal} />}
        </>
    );
};

export default Notes;