import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note } from "../../logic/interfaces";
import { deleteNoteById, getNoteById, updateNoteById } from "../../logic/notes";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { enqueueSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: 700, mr: 5, mt: 2 }}>
          {note ? (
            <CardContent
              sx={{ mt: 2, display: "flex", flexDirection: "column" }}
            >
              <TextField
                placeholder={"Title"}
                fullWidth
                value={note.title}
                onChange={(event) =>
                  setNote({ ...note, title: event.target.value })
                }
              />
              <TextField
                multiline
                rows={15}
                placeholder={"Write your note here..."}
                fullWidth
                value={note.description}
                onChange={(event) =>
                  setNote({ ...note, description: event.target.value })
                }
              />
              <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
                <Button
                  variant="contained"
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
            </CardContent>
          ) : (
            <CircularProgress />
          )}
        </Card>
      </Box>
    </>
  );
};

export default SingleNote;
