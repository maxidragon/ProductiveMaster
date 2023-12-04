import { useEffect, useState } from "react";
import {
  Link,
  TableRow,
  TableCell,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  GitHub as GitHubIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";
import { Project } from "../../../logic/interfaces";
import { deleteProject } from "../../../logic/projects";
import { statusPretyName } from "../../../logic/other";
import { isProjectOwner } from "../../../logic/projectParticipants";
import ProjectStatsModal from "../../ModalComponents/ProjectStatsModal";
import EditProjectModal from "../../ModalComponents/Edit/EditProjectModal";

interface Props {
  project: Project;
  handleStatusUpdate: (status: string) => void;
}

const ProjectRow = ({ project, handleStatusUpdate }: Props): JSX.Element => {
  const confirm = useConfirm();
  const [hide, setHide] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>(project);
  const [isOwner, setIsOwner] = useState(false);
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const handleDelete = async (): Promise<void> => {
    if (project === null) return;
    confirm({
      description:
        "Are you sure you want to delete this project and all tasks?",
    })
      .then(async () => {
        const status = await deleteProject(project.id);
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
  const updateProject = (project: Project): void => {
    setEditedProject(project);
  };

  const handleCloseEditModal = (): void => {
    setEdit(false);
    handleStatusUpdate(editedProject.status);
  };

  useEffect(() => {
    const fetchData = async () => {
      const isOwner = await isProjectOwner(project.id);
      setIsOwner(isOwner["is_owner"]);
    };
    fetchData();
  }, [project.id]);

  return (
    <>
      {!hide && (
        <TableRow
          key={editedProject.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Link to={`/projects/${editedProject.id}`} component={RouterLink}>
              {editedProject.title}
            </Link>
          </TableCell>
          <TableCell>{editedProject.description}</TableCell>
          <TableCell>
            <Box sx={{ display: "inline-block", ml: 1 }}>
              <Chip
                label={statusPretyName(editedProject.status)}
                color={
                  editedProject.status === "PLANNED"
                    ? "primary"
                    : editedProject.status === "IN_PROGRESS"
                      ? "warning"
                      : "success"
                }
              />
            </Box>
          </TableCell>
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
            <IconButton
              component={RouterLink}
              to={`/participants/${editedProject.id}`}
            >
              <PeopleIcon />
            </IconButton>
            <IconButton onClick={() => setOpenStatsModal(true)}>
              <BarChartIcon />
            </IconButton>
            {isOwner && (
              <>
                <IconButton onClick={() => setEdit(true)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </TableCell>
        </TableRow>
      )}
      <ProjectStatsModal
        open={openStatsModal}
        handleClose={() => setOpenStatsModal(false)}
        projectId={editedProject.id}
      />
      {edit && (
        <EditProjectModal
          open={edit}
          handleClose={handleCloseEditModal}
          project={editedProject}
          editProject={updateProject}
        />
      )}
    </>
  );
};

export default ProjectRow;
