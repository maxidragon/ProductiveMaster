import { useState, useCallback, useEffect } from "react";
import Avatar from "react-avatar";
import { getUserAvatar } from "../logic/auth";

interface Props {
  userId: number;
  username: string;
  size: string;
}

const AvatarComponent = ({ userId, username, size }: Props): JSX.Element => {
  const [avatarUrl, setAvatarUrl] = useState("");

  const getAvatarUrl = useCallback(async (): Promise<void> => {
    const blob = await getUserAvatar(userId);
    if (blob.status === 200) {
      setAvatarUrl(blob.url);
    }
  }, [userId]);

  useEffect(() => {
    getAvatarUrl();
  }, [getAvatarUrl]);

  return (
    <>
      {avatarUrl ? (
        <img
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
          }}
          src={avatarUrl}
        />
      ) : (
        <Avatar name={username} size={size} round={true} />
      )}
    </>
  );
};

export default AvatarComponent;
