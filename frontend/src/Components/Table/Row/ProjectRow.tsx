import { useState } from "react";
import { Link, TableRow, TableCell, IconButton } from "@mui/material";
import { Project } from "../../../logic/interfaces";
import GitHubIcon from "@mui/icons-material/GitHub";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { deleteProject } from "../../../logic/projects";
import { Link as RouterLink } from "react-router-dom";
import EditProjectModal from "../../ModalComponents/Edit/EditProjectModal";
import { statusPretyName } from "../../../logic/other";
import BarChartIcon from "@mui/icons-material/BarChart";
import ProjectStatsModal from "../../ModalComponents/ProjectStatsModal";

const ProjectRow = (props: {
  project: Project;
  handleStatusUpdate: (status: string) => void;
}) => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>(props.project);
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const handleDelete = async () => {
    if (props.project === null) return;
    confirm({
      description:
        "Are you sure you want to delete this project and all tasks?",
    })
      .then(async () => {
        const status = await deleteProject(props.project.id.toString());
        if (status === 204) {
          enqueueSnackbar("Project deleted!", { variant: "success" });
          setHide(true);
        } else {
          enqueueSnackbar("Something went wrong!", { variant: "error" });
        }
      })
      .catch(() => {
        enqueueSnackbar("Project not deleted!", { variant: "info" });
      });
  };
  const updateProject = (project: Project) => {
    setEditedProject(project);
  };

  const handleCloseEditModal = () => {
    setEdit(false);
    props.handleStatusUpdate(editedProject.status);
  };

  return (
    <>
      {!hide && (
        <TableRow
          key={editedProject.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {editedProject.title}
          </TableCell>
          <TableCell>{editedProject.description}</TableCell>
          <TableCell>{statusPretyName(editedProject.status)}</TableCell>
          <TableCell>
            {editedProject.github && (
              <IconButton
                component={Link}
                href={editedProject.github}
                target="_blank"
              >
                <GitHubIcon />
              </IconButton>
            )}
            <IconButton
              component={RouterLink}
              to={`/tasks/project/${editedProject.id}`}
            >
              <AssignmentIcon />
            </IconButton>
            <IconButton
              component={RouterLink}
              to={`/documents/${editedProject.id}`}
            >
              <DescriptionIcon />
            </IconButton>
            <IconButton onClick={() => setOpenStatsModal(true)}>
              <BarChartIcon />
            </IconButton>
            <IconButton onClick={() => setEdit(true)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )}
      <ProjectStatsModal
        open={openStatsModal}
        handleClose={() => setOpenStatsModal(false)}
        id={editedProject.id}
      />
      {edit && (
        <EditProjectModal
          open={edit}
          handleClose={handleCloseEditModal}
          project={editedProject}
          updateProject={updateProject}
        />
      )}
    </>
  );
};

export default ProjectRow;
