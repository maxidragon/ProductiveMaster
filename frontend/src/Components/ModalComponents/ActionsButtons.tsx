import { ReactElement } from "react";
import { Box, Button } from "@mui/material";
import { actionsButtons } from "./modalStyles";
import CancelIcon from "@mui/icons-material/Cancel";

interface Props {
  cancel: () => void;
  submit: () => void;
  submitText: string;
  submitIcon: ReactElement;
}

const ActionsButtons = ({ cancel, submit, submitText, submitIcon }: Props) => {
  return (
    <Box sx={actionsButtons}>
      <Button variant="contained" endIcon={<CancelIcon />} onClick={cancel}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color="success"
        endIcon={submitIcon}
        onClick={submit}
      >
        {submitText}
      </Button>
    </Box>
  );
};

export default ActionsButtons;
