import { useEffect, useState } from "react";
import {
  Link,
  IconButton,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Project,
  TaskForProject,
  Document as DocumentInterface,
  ProjectParticipant,
} from "../../logic/interfaces";
import GitHubIcon from "@mui/icons-material/GitHub";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import { deleteProject, getProjectById } from "../../logic/projects";
import EditProjectModal from "../../Components/ModalComponents/Edit/EditProjectModal";
import ProjectStatsModal from "../../Components/ModalComponents/ProjectStatsModal";
import RecentTasksTable from "../../Components/Table/RecentTasksTable";
import { getRecentTasks } from "../../logic/tasks";
import RecentDocumentsTable from "../../Components/Table/RecentDocumentsTable";
import { getMostActiveParticipants } from "../../logic/projectParticipants";
import AvatarComponent from "../../Components/AvatarComponent";
import CreateTaskModal from "../../Components/ModalComponents/Create/CreateTaskModal";
import CreateDocumentModal from "../../Components/ModalComponents/Create/CreateDocumentModal";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getRecentDocuments } from "../../logic/documents";

const SingleProject = () => {
  const { projectId } = useParams();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>();
  const [isOwner, setIsOwner] = useState(false);
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const [recentTasks, setRecentTasks] = useState<TaskForProject[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<DocumentInterface[]>(
    [],
  );
  const [mostActiveParticipants, setMostActiveParticipants] = useState<
    ProjectParticipant[]
  >([]);
  const [taskCreateModalOpen, setTaskCreateModalOpen] = useState(false);
  const [documentCreateModalOpen, setDocumentCreateModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!projectId) return;
    confirm({
      description:
        "Are you sure you want to delete this project and all tasks?",
    })
      .then(async () => {
        const status = await deleteProject(+projectId);
        if (status === 204) {
          enqueueSnackbar("Project deleted!", { variant: "success" });
          navigate("/projects");
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
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      const project = await getProjectById(+projectId);
      setEditedProject(project.data);
      setIsOwner(project.isOwner);
    };
    fetchData();
    fetchRecentTasks();
    fetchRecentDocuments();
    fetchMostActiveParticipants();
  }, [projectId]);

  const fetchRecentTasks = async () => {
    if (!projectId) return;
    const data = await getRecentTasks(+projectId);
    setRecentTasks(data);
  };

  const fetchRecentDocuments = async () => {
    if (!projectId) return;
    const data = await getRecentDocuments(+projectId);
    setRecentDocuments(data);
  };

  const fetchMostActiveParticipants = async () => {
    if (!projectId) return;
    const data = await getMostActiveParticipants(+projectId);
    setMostActiveParticipants(data);
  };

  const handleCloseTaskCreateModal = async () => {
    setTaskCreateModalOpen(false);
    await fetchRecentTasks();
  };

  const handleCloseDocumentCreateModal = async () => {
    setDocumentCreateModalOpen(false);
    await fetchRecentDocuments();
  };

  return (
    <>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        container
        spacing={2}
      >
        {editedProject ? (
          <>
            <Grid item>
              <Typography variant="h4">
                Project {editedProject.title}
              </Typography>
              <Typography variant="h6">{editedProject.description}</Typography>
            </Grid>
            <Grid item>
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
            </Grid>
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
        ) : (
          <CircularProgress />
        )}
        <Grid item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="h5">Recent tasks</Typography>
            <IconButton onClick={() => setTaskCreateModalOpen(true)}>
              <AddTaskIcon />
            </IconButton>
          </Box>
          <RecentTasksTable
            tasks={recentTasks}
            fetchData={fetchRecentTasks}
            isProjectOwner={isOwner}
          />
        </Grid>
        <Grid item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="h5">Recent documents</Typography>
            <IconButton onClick={() => setDocumentCreateModalOpen(true)}>
              <AddCircleIcon />
            </IconButton>
          </Box>
          <RecentDocumentsTable
            documents={recentDocuments}
            isProjectOwner={isOwner}
          />
        </Grid>
        <Grid item sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5">Active participants</Typography>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {mostActiveParticipants.map((participant) => (
              <Tooltip title={participant.user.id}>
                <IconButton>
                  <AvatarComponent
                    userId={participant.user.id}
                    username={participant.user.username}
                    size="30px"
                  />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Grid>
      </Grid>
      {taskCreateModalOpen && projectId && (
        <CreateTaskModal
          open={taskCreateModalOpen}
          handleClose={handleCloseTaskCreateModal}
          projectId={+projectId}
        />
      )}
      {documentCreateModalOpen && projectId && (
        <CreateDocumentModal
          open={documentCreateModalOpen}
          handleClose={handleCloseDocumentCreateModal}
          projectId={+projectId}
        />
      )}
    </>
  );
};

export default SingleProject;
