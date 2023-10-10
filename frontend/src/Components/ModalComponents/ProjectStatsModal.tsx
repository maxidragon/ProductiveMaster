import { useEffect, useState } from "react";
import { Modal, Box, Typography, Grid } from "@mui/material";
import { formStyle, style } from "./modalStyles";
import { ProjectStats } from "../../logic/interfaces";
import { getProjectStatistics } from "../../logic/projects";

const ProjectStatsModal = (props: {
  open: boolean;
  handleClose: () => void;
  id: number;
}) => {
  const [stats, setStats] = useState<ProjectStats | null>(null);

  useEffect(() => {
    const getStats = async () => {
      const data = await getProjectStatistics(props.id);
      setStats(data);
    };
    getStats();
  });

  return (
    <>
      <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={style}>
          <Grid container sx={formStyle}>
            {stats && (
              <>
                <Grid item sx={{ mb: 2 }}>
                  <Typography variant="h5">
                    Statistics for project {stats.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    Tasks TODO: {stats.num_tasks_todo}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    Tasks in progress: {stats.num_tasks_in_progress}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    Tasks done: {stats.num_tasks_done}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    Tasks done last week: {stats.num_tasks_done_last_week}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    Tasks done last month: {stats.num_tasks_done_last_month}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ProjectStatsModal;
