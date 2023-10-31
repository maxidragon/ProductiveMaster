import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import Layout from "./Layout/Layout";
import Notes from "./Pages/Notes/Notes";
import SingleNote from "./Pages/Notes/SingleNote";
import Goals from "./Pages/Goals/Goals";
import Projects from "./Pages/Projects/Projects";
import ErrorElement from "./Pages/ErrorElement/ErrorElement";
import TasksForProject from "./Pages/Tasks/TasksForProject";
import Tasks from "./Pages/Tasks/Tasks";
import Activities from "./Pages/Activities/Activities";
import GoalCategories from "./Pages/GoalCategories/GoalCategories";
import Settings from "./Pages/Settings/Settings";
import DocumentsForProject from "./Pages/Documents/DocumentsForProject";
import Learning from "./Pages/Learning/Learning";
import LearningCategories from "./Pages/LearningCategories/LearningCategories";
import LearningResources from "./Pages/LearningResources/LearningResources";
import ForgotPassword from "./Pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import ProjectParticipants from "./Pages/ProjectParticipants/ProjectParticipants";
import SingleProject from "./Pages/Projects/SingleProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children={<Dashboard />} />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/auth/password/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/password/reset/:resetId",
    element: <ResetPassword />,
  },
  {
    path: "/notes",
    element: <Layout children={<Notes />} />,
  },
  {
    path: "/note/:id",
    element: <Layout children={<SingleNote />} />,
  },
  {
    path: "/goals",
    element: <Layout children={<Goals />} />,
  },
  {
    path: "/projects",
    element: <Layout children={<Projects />} />,
  },
  {
    path: "/projects/:projectId",
    element: <Layout children={<SingleProject />} />,
  },
  {
    path: "/tasks",
    element: <Layout children={<Tasks />} />,
  },
  {
    path: "/tasks/project/:projectId",
    element: <Layout children={<TasksForProject />} />,
  },
  {
    path: "documents/:projectId",
    element: <Layout children={<DocumentsForProject />} />,
  },
  {
    path: "/participants/:projectId",
    element: <Layout children={<ProjectParticipants />} />,
  },
  {
    path: "/activities",
    element: <Layout children={<Activities />} />,
  },
  {
    path: "/goals/categories",
    element: <Layout children={<GoalCategories />} />,
  },
  {
    path: "/settings",
    element: <Layout children={<Settings />} />,
  },
  {
    path: "/learning",
    element: <Layout children={<Learning />} />,
  },
  {
    path: "/learning/categories",
    element: <Layout children={<LearningCategories />} />,
  },
  {
    path: "learning/:learningId/resources",
    element: <Layout children={<LearningResources />} />,
  },
  {
    path: "*",
    element: <Layout children={<ErrorElement message="404 not found" />} />,
  },
]);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={darkTheme}>
        <SnackbarProvider>
          <ConfirmProvider>
            <RouterProvider router={router} />
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
