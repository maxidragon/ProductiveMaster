import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import { SnackbarProvider } from "notistack";
import { ConfirmProvider } from "material-ui-confirm";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Layout from "./Layout/Layout";
import Notes from "./Pages/Notes/Notes";

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
  // {
  //     path: "/about",
  //     element: <Layout children={<About />} />
  // },
  {
    path: "/notes",
    element: <Layout children={<Notes />} />
  }
  // {
  //     path: "*",
  //     element: <Layout children={<ErrorElement message="404 not found" />} />
  // }
]);
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
const App = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <SnackbarProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;