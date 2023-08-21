import { ReactElement } from "react";
import { Box, Button } from "@mui/material";
import { actionsButtons, buttonStyle } from "./modalStyles";
import CancelIcon from "@mui/icons-material/Cancel";

const ActionsButtons = (props: {
  cancel: () => void;
  submit: () => void;
  submitText: string;
  submitIcon: ReactElement;
}) => {
  return (
    <Box sx={actionsButtons}>
      <Button
        variant="contained"
        sx={buttonStyle}
        endIcon={<CancelIcon />}
        onClick={props.cancel}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="success"
        endIcon={props.submitIcon}
        onClick={props.submit}
      >
        {props.submitText}
      </Button>
    </Box>
  );
};

export default ActionsButtons;
