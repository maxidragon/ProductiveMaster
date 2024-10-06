import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note } from "../../logic/interfaces";
import { deleteNoteById, getNoteById, updateNoteById } from "../../logic/notes";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CopyAll as CopyIcon,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import MDEditor from "@uiw/react-md-editor";
const SingleNote = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [note, setNote] = useState<Note | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getNoteById(+id);
        setNote(data);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = async () => {
    if (note === null) return;
    const status = await updateNoteById(note);
    if (status === 200) {
      enqueueSnackbar("Note updated!", { variant: "success" });
    } else {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }
  };

  const handleDelete = async () => {
    if (note === null) return;
    confirm({ description: "Are you sure you want to delete this note?" })
      .then(async () => {
        const status = await deleteNoteById(note.id);
        if (status === 204) {
          enqueueSnackbar("Note deleted!", { variant: "success" });
          navigate("/notes");
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Note not deleted!", { variant: "info" });
      });
  };

  const handleCopy = () => {
    if (!note) return;
    navigator.clipboard.writeText(note.description);
    enqueueSnackbar("Note copied!", { variant: "success" });
  };

  if (!note)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          placeholder={"Title"}
          fullWidth
          value={note.title}
          onChange={(event) => setNote({ ...note, title: event.target.value })}
        />
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
          <MDEditor
            value={note.description}
            autoFocus
            height="60vh"
            textareaProps={{
              placeholder: "Add your note here...",
            }}
            onChange={(value) => {
              setNote({ ...note, description: value || "" });
            }}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "end", gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            endIcon={<CopyIcon />}
            onClick={handleCopy}
          >
            Copy
          </Button>
          <Button
            variant="contained"
            color="success"
            endIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SingleNote;
