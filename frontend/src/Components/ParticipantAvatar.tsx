import { Tooltip, IconButton } from "@mui/material";
import { ProjectParticipant } from "../logic/interfaces";
import AvatarComponent from "./AvatarComponent";

const ParticipantAvatar = ({
  participant,
}: {
  participant: ProjectParticipant;
}) => {
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
