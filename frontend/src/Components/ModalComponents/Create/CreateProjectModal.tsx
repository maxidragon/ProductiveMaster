import { useRef } from 'react';
import { Box, Typography, Modal, TextField, Grid } from '@mui/material';
import { style, formStyle } from '../modalStyles';
import { enqueueSnackbar } from 'notistack';
import { createProject } from '../../../logic/projects';
import ActionsButtons from '../ActionsButtons';

const CreateProjectModal = (props: { open: boolean; handleClose: any }) => {
  const titleRef: any = useRef();
  const descriptionRef: any = useRef();
  const githubLinkRef: any = useRef();

  const handleCreate = async (event: any) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const github = githubLinkRef.current.value;
    const status = await createProject(title, description, github);
    if (status === 201) {
      enqueueSnackbar('Project created!', { variant: 'success' });
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
              Create project
            </Typography>
          </Grid>
          <Grid item>
            <TextField placeholder={'Title'} fullWidth inputRef={titleRef} />
          </Grid>
          <Grid item>
            <TextField placeholder={'Github'} fullWidth inputRef={githubLinkRef} />
          </Grid>
          <Grid item>
            <TextField
              multiline
              rows={15}
              placeholder={'Write project description  here...'}
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

export default CreateProjectModal;
