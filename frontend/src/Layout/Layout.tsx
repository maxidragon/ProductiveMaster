import { ReactElement, useEffect, useState } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Container,
} from "@mui/material";
import AppBar from "./AppBar";
import Drawer from "./Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import LoginPartial from "./LoginPartial";
import { isUserLoggedIn } from "../logic/auth";
import Navbar from "./Navbar";
import Copyright from "./Copyright";

interface Props {
  children: ReactElement;
}

const Layout = ({ children }: Props): JSX.Element => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [openProjectNav, setOpenProjectNav] = useState<boolean>(true);
  const [openLearningNav, setOpenLearningNav] = useState<boolean>(true);
  const userLoggedIn = isUserLoggedIn();

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/auth/login");
    }
  }, [userLoggedIn, navigate]);

  const toggleDrawer = () => {
    setOpen(!open);
    if (open) {
      setOpenProjectNav(false);
      setOpenLearningNav(false);
    } else {
      setOpenProjectNav(true);
      setOpenLearningNav(true);
    }
  };

  const toggleProjectNav = () => {
    setOpenProjectNav(!openProjectNav);
  };

  const toggleLearningNav = () => {
    setOpenLearningNav(!openLearningNav);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
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
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <Typography variant="h6" noWrap component="div">
            ProductiveMaster
          </Typography>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <Navbar
          openProjectNav={openProjectNav}
          toggleProjectNav={toggleProjectNav}
          openLearningNav={openLearningNav}
          toggleLearningNav={toggleLearningNav}
        />
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
        <Copyright />
      </Box>
    </Box>
  );
};

export default Layout;
