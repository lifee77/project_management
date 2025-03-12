import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Divider,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectSelector from '../components/ProjectSelector';
import { getSprints, getTasks } from '../services/api';
import AddSprintForm from '../components/AddSprintForm';
import AddProjectForm from '../components/AddProjectForm';

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [sprints, setSprints] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddSprintForm, setShowAddSprintForm] = useState<boolean>(false);
  const [showAddProjectForm, setShowAddProjectForm] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProject) {
      fetchSprints();
      fetchStatistics();
    }
  }, [selectedProject]);

  const fetchSprints = async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      const response = await getSprints({ project: selectedProject });
      // Ensure sprints is always an array
      if (Array.isArray(response.data)) {
        setSprints(response.data);
      } else {
        console.error('Expected array of sprints but got:', response.data);
        setSprints([]);
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);
      setSprints([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await getTasks({ project: selectedProject });
      const tasks = response.data;
      
      setStatistics({
        totalTasks: tasks.length,
        completedTasks: tasks.filter((task: any) => task.status === 'done').length,
        highPriorityTasks: tasks.filter((task: any) => task.priority === 'high').length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleSprintClick = (sprintId: string) => {
    navigate(`/sprint/${sprintId}`);
  };

  const handleBacklogClick = () => {
    navigate(`/backlog`);
  };

  const handleSprintAdded = () => {
    setShowAddSprintForm(false);
    fetchSprints();
  };

  const handleProjectAdded = () => {
    setShowAddProjectForm(false);
    // Force a re-render of the ProjectSelector which should fetch new projects
    setSelectedProject('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Dashboard
      </Typography>
      
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item>
          <ProjectSelector 
            value={selectedProject} 
            onChange={handleProjectChange} 
          />
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddProjectForm(true)}
            sx={{ mr: 1 }}
          >
            New Project
          </Button>
          {selectedProject && (
            <Button 
              variant="contained"
              onClick={() => setShowAddSprintForm(true)}
            >
              Add Sprint
            </Button>
          )}
        </Grid>
      </Grid>
      
      {selectedProject ? (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Total Tasks
                </Typography>
                <Typography component="p" variant="h3">
                  {statistics.totalTasks}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Completed Tasks
                </Typography>
                <Typography component="p" variant="h3">
                  {statistics.completedTasks}
                </Typography>
                <Box sx={{ textAlign: 'right', mt: 'auto' }}>
                  <Typography color="text.secondary">
                    {statistics.totalTasks > 0
                      ? `${Math.round((statistics.completedTasks / statistics.totalTasks) * 100)}%`
                      : '0%'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  High Priority Tasks
                </Typography>
                <Typography component="p" variant="h3">
                  {statistics.highPriorityTasks}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Sprints
              </Typography>
              <Button variant="outlined" onClick={handleBacklogClick}>
                View Backlog
              </Button>
            </Box>
            
            {loading ? (
              <Typography>Loading sprints...</Typography>
            ) : Array.isArray(sprints) && sprints.length > 0 ? (
              <Grid container spacing={3}>
                {sprints.map((sprint) => (
                  <Grid item xs={12} md={4} key={sprint._id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" component="h3">
                            {sprint.name}
                          </Typography>
                          {sprint.isActive && <Chip label="Active" color="success" size="small" />}
                        </Box>
                        <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                          {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          {sprint.taskCount || 0} Tasks
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleSprintClick(sprint._id)}>
                          View Sprint
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography>No sprints found. Get started by creating a new sprint.</Typography>
              </Paper>
            )}
          </Box>
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Please select a project to see dashboard details.</Typography>
        </Paper>
      )}
      
      <AddSprintForm 
        open={showAddSprintForm}
        onClose={() => setShowAddSprintForm(false)}
        onSave={handleSprintAdded}
        projectId={selectedProject}
      />

      <AddProjectForm 
        open={showAddProjectForm}
        onClose={() => setShowAddProjectForm(false)}
        onSave={handleProjectAdded}
      />
    </Container>
  );
};

export default Dashboard;
