import { Box, Grid, Typography } from "@mui/material";
import errorImage from "./error.svg";

const ErrorElement = (props: { message: string }) => {
  return (
    <>
      <Box sx={{ width: "100%", py: 4 }}>
        <Grid container direction="column" spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="h3" color="red">
              Error
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" color="red">
              {props.message}
            </Typography>
          </Grid>
          <Grid item>
            <Box
              component="img"
              src={errorImage}
              height={300}
              alt="error"
              sx={{ maxWidth: "100%" }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ErrorElement;
