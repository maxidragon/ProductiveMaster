import { Box, Button } from '@mui/material';
import { actionsButtons, buttonStyle } from './modalStyles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ActionsButtons = (props: { cancel: any; submit: any; submitText: string }) => {
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
        endIcon={<AddCircleIcon />}
        onClick={props.submit}
      >
        {props.submitText}
      </Button>
    </Box>
  );
};

export default ActionsButtons;
