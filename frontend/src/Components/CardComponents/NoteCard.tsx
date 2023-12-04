import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import { Note } from "../../logic/interfaces";

interface Props {
  note: Note;
}

const NoteCard = ({ note }: Props): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Card
      role="card"
      sx={{
        width: 300,
        mr: 5,
        mt: 2,
        cursor: note ? "pointer" : "normal",
      }}
      onClick={() => {
        if (note.description) {
          navigate(`/note/${note.id}`);
        }
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">{note.title}</Typography>
        <Typography variant="body2">
          {note.description && note.description.substring(0, 200) + "..."}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
