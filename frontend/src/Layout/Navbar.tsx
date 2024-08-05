import { Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginPartial from "./LoginPartial";
import AppBar from "./AppBar";

interface Props {
  open: boolean;
  toggleDrawer: () => void;
  userLoggedIn: boolean;
}

const Navbar = ({ open, toggleDrawer, userLoggedIn }: Props) => {
  return (
    <AppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Dashboard
        </Typography>
        <LoginPartial userLoggedIn={userLoggedIn} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
