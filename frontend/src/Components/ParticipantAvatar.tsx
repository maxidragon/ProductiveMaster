import { Tooltip, IconButton } from "@mui/material";
import { ProjectParticipant } from "../logic/interfaces";
import AvatarComponent from "./AvatarComponent";

interface Props {
  participant: ProjectParticipant;
}
const ParticipantAvatar = ({ participant }: Props): JSX.Element => {
  return (
    <Tooltip title={participant.user.username}>
      <IconButton>
        <AvatarComponent
          userId={participant.user.id}
          username={participant.user.username}
          size="30px"
        />
      </IconButton>
    </Tooltip>
  );
};

export default ParticipantAvatar;
