import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Layout from "./Layout/Layout";
import Notes from "./Pages/Notes/Notes";
import SingleNote from "./Pages/Notes/SingleNote";
import Goals from "./Pages/Goals/Goals";
import Projects from "./Pages/Projects/Projects";
import ErrorElement from "./Pages/ErrorElement/ErrorElement";
import TasksForProject from "./Pages/Tasks/TasksForProject";
import Tasks from "./Pages/Tasks/Tasks";
import Activities from "./Pages/Activities/Activities";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GoalCategories from "./Pages/GoalCategories/GoalCategories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout children={<Dashboard />} />
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
    path: "/notes",
    element: <Layout children={<Notes />} />
  },
  {
    path: "/note/:id",
    element: <Layout children={<SingleNote />} />
  },
  {
    path: "/goals",
    element: <Layout children={<Goals />} />
  },
  {
    path: "/projects",
    element: <Layout children={<Projects />} />
  },
  {
    path: "/tasks",
    element: <Layout children={<Tasks />} />
  },
  {
    path: "/tasks/project/:projectId",
    element: <Layout children={<TasksForProject />} />
  },
  {
    path: "/activities",
    element: <Layout children={<Activities />} />
  },
  {
    path: "/goals/categories",
    element: <Layout children={<GoalCategories />} />
  },
  {
    path: "*",
    element: <Layout children={<ErrorElement message="404 not found" />} />
  }
]);
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={lightTheme}>
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