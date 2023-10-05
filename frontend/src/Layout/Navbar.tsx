import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { RecentLearning, RecentProject } from "../logic/interfaces";
import { getRecentProjects } from "../logic/projects";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import BookIcon from "@mui/icons-material/Book";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TopicIcon from "@mui/icons-material/Topic";
import { getRecentLearnings } from "../logic/learning";

const Navbar = () => {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentLearnings, setRecentLearnings] = useState<RecentLearning[]>([]);
  const [openProjectNav, setOpenProjectNav] = useState<boolean>(true);
  const [openLearningNav, setOpenLearningNav] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const projects = await getRecentProjects();
      const learnings = await getRecentLearnings();
      setRecentProjects(projects);
      setRecentLearnings(learnings);
    };
    fetchData();
  }, []);

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
        <IconButton
          onClick={() => {
            setOpenProjectNav(!openProjectNav);
          }}
        >
          {" "}
          {openProjectNav ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </ListItemButton>
      <Collapse in={openProjectNav} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {recentProjects.map((project: RecentProject) => (
            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to={`/tasks/project/${project.id}`}
              key={project.id}
            >
              <ListItemIcon>
                <TopicIcon />
              </ListItemIcon>
              <ListItemText primary={project.title} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
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
      <ListItemButton component={Link} to={"/learning"}>
        <ListItemIcon>
          <BookIcon />
        </ListItemIcon>
        <ListItemText primary="Learning" />
        <IconButton
          onClick={() => {
            setOpenLearningNav(!openLearningNav);
          }}
        >
          {" "}
          {openLearningNav ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </ListItemButton>
      <Collapse in={openLearningNav} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {recentLearnings.map((learning: RecentLearning) => (
            <ListItemButton
              sx={{ pl: 4 }}
              component={Link}
              to={`/learning/${learning.id}/resources`}
              key={learning.id}
            >
              <ListItemIcon>
                <TopicIcon />
              </ListItemIcon>
              <ListItemText primary={learning.title} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
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
