import { Box, Grid, Modal, TextField, Typography } from '@mui/material';
import { useRef } from 'react';
import { formStyle, style } from '../modalStyles';
import { createNote } from '../../../logic/notes';
import { enqueueSnackbar } from 'notistack';
import ActionsButtons from '../ActionsButtons';

const CreateNoteModal = (props: { open: boolean; handleClose: any }) => {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();

  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const status = await createNote(title, description);
    if (status === 201) {
      enqueueSnackbar('Note created!', { variant: 'success' });
      props.handleClose();
    } else {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <Grid container sx={formStyle}>
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create note
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={'Title'} fullWidth inputRef={titleRef} />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={'Write your note here...'}
              fullWidth
              inputRef={descriptionRef}
            />
          </Grid>
        </Grid>
        <ActionsButtons
          cancel={props.handleClose}
          submit={handleCreate}
          submitText={'Create'}
        />
      </Box>
    </Modal>
  );
};

export default CreateNoteModal;
