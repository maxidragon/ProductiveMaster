import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUsername, logout } from '../logic/auth';

const LoginPartial = (props: { userLoggedIn: boolean }) => {
  const navigate = useNavigate();
  const username = getUsername();
  return (
    <>
      {props.userLoggedIn && (
        <>
          <Typography>Hello {username}</Typography>

          <IconButton
            color="inherit"
            onClick={(event: any) => {
              event.preventDefault();
              logout();
              navigate('/auth/login');
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
