import { useState, useCallback, useEffect } from "react";
import Avatar from "react-avatar";
import { getUserAvatar } from "../logic/auth";

const AvatarComponent = (props: {
  userId: number;
  username: string;
  size: string;
}) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  const getAvatarUrl = useCallback(async (): Promise<void> => {
    const blob = await getUserAvatar(props.userId);
    if (blob.status === 200) {
      setAvatarUrl(blob.url);
    }
  }, [props.userId]);

  useEffect(() => {
    getAvatarUrl();
  }, [getAvatarUrl]);

  return (
    <>
      {avatarUrl ? (
        <img
          style={{
            width: props.size,
            height: props.size,
            borderRadius: "50%",
          }}
          src={avatarUrl}
        />
      ) : (
        <Avatar name={props.username} size={props.size} round={true} />
      )}
    </>
  );
};

export default AvatarComponent;
