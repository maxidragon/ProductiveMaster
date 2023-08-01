import LogoutIcon from '@mui/icons-material/Logout';
import {IconButton} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import { logout } from "../logic/auth";
import SettingsIcon from '@mui/icons-material/Settings';

const LoginPartial = (props: {userLoggedIn: boolean}) => {
    const navigate = useNavigate();


    return (
        <>
            {props.userLoggedIn && (<>
                    <IconButton color="inherit" onClick={(event: any) => {
                        event.preventDefault();
                        logout();
                        navigate('/auth/login');
                        window.location.reload();
                    }}><LogoutIcon fontSize="medium"/></IconButton>
                    <IconButton component={Link} to={`/settings`} rel="noopener noreferrer">
                        <SettingsIcon sx={{color: "#fff"}} fontSize="medium"/>
                    </IconButton>
                </>)
            }
        </>
    )
};

export default LoginPartial;