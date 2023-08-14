import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Note } from "../../logic/interfaces";

const NoteCard = (props: { note: Note }) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: 300,
        mr: 5,
        mt: 2,
        cursor: props.note ? "pointer" : "normal",
      }}
      onClick={() => {
        if (props.note.description) {
          navigate(`/note/${props.note.id}`);
        }
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">{props.note.title}</Typography>
        <Typography variant="body2">
          {props.note.description &&
            props.note.description.substring(0, 200) + "..."}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
