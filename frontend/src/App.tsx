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
import LearningResourcesSearch from "./Pages/LearningResources/LearningResourcesSearch";
import DailyTasks from "./Pages/DailyTasks/DailyTasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/notes",
        element: <Notes />,
      },
      {
        path: "/note/:id",
        element: <SingleNote />,
      },
      {
        path: "/goals",
        element: <Goals />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/:projectId",
        element: <SingleProject />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/tasks/project/:projectId",
        element: <TasksForProject />,
      },
      {
        path: "documents/:projectId",
        element: <DocumentsForProject />,
      },
      {
        path: "/participants/:projectId",
        element: <ProjectParticipants />,
      },
      {
        path: "/daily-tasks",
        element: <DailyTasks />,
      },
      {
        path: "/goals/categories",
        element: <GoalCategories />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/learning",
        element: <Learning />,
      },
      {
        path: "/learning/categories",
        element: <LearningCategories />,
      },
      {
        path: "learning/resources",
        element: <LearningResourcesSearch />,
      },
      {
        path: "learning/:learningId/resources",
        element: <LearningResources />,
      },
      {
        path: "*",
        element: <ErrorElement message="404 not found" />,
      },
    ],
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
          <ConfirmProvider useLegacyReturn>
            <RouterProvider router={router} />
          </ConfirmProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
