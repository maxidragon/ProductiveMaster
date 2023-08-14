import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar = () => {
  return (
    <List component="nav">
      <ListItemButton component={Link} to={"/"}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton component={Link} to={"/projects"}>
        <ListItemIcon>
          <FolderCopyIcon />
        </ListItemIcon>
        <ListItemText primary="Projects" />
      </ListItemButton>
      <ListItemButton component={Link} to={"/tasks"}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Tasks" />
      </ListItemButton>
      <ListItemButton component={Link} to={"/activities"}>
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <ListItemText primary="Activities" />
      </ListItemButton>
      <ListItemButton component={Link} to={"/notes"}>
        <ListItemIcon>
          <NoteAltIcon />
        </ListItemIcon>
        <ListItemText primary="Notes" />
      </ListItemButton>
      <ListItemButton component={Link} to={"/goals"}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Goals" />
      </ListItemButton>
      <ListItemButton component={Link} to={"/settings"}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </List>
  );
};

export default Navbar;
