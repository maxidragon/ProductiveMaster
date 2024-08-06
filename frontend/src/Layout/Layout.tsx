import { ReactElement, useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Container,
  CssBaseline,
} from "@mui/material";

import Drawer from "./Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "../logic/auth";
import Sidebar from "./Sidebar";
import Copyright from "./Copyright";
import Navbar from "./Navbar";

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

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 800) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar
        open={open}
        toggleDrawer={toggleDrawer}
        userLoggedIn={userLoggedIn}
      />
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
        <Sidebar
          openProjectNav={openProjectNav}
          toggleProjectNav={toggleProjectNav}
          openLearningNav={openLearningNav}
          toggleLearningNav={toggleLearningNav}
        />
      </Drawer>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.grey[900],
          color: "white",
          flexGrow: 1,
          minHeight: "100vh",
          mt: 8,
          overflow: "auto",
        }}
      >
        <Container sx={{ mt: 4, mb: 4 }}>{children}</Container>
        <Box sx={{ mt: "auto", mb: 2 }}>
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
