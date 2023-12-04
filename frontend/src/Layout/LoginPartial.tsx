import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUsername, logout } from "../logic/auth";
import AvatarComponent from "../Components/AvatarComponent";

interface Props {
  userLoggedIn: boolean;
}

const LoginPartial = ({ userLoggedIn }: Props): JSX.Element => {
  const navigate = useNavigate();
  const username = getUsername();
  return (
    <>
      {userLoggedIn && username && (
        <>
          <IconButton
            onClick={() => {
              navigate("/settings");
            }}
          >
            <AvatarComponent
              userId={localStorage.getItem("userId") as unknown as number}
              username={username}
              size="30px"
            />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              logout();
              navigate("/auth/login");
              window.location.reload();
            }}
          >
            <LogoutIcon fontSize="medium" />
          </IconButton>
        </>
      )}
    </>
  );
};

export default LoginPartial;
