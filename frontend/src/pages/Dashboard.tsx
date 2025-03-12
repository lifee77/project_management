import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip
} from '@mui/material';
import ProjectSelector from '../components/ProjectSelector';
import { getSprints, getTasks } from '../services/api';
import AddSprintForm from '../components/AddSprintForm';

const Dashboard = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [sprints, setSprints] = useState<any[]>([]);
  const [taskStats, setTaskStats] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [openSprintForm, setOpenSprintForm] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProject) {
      fetchSprints();
      fetchTaskStats();
    }
  }, [selectedProject]);

  const fetchSprints = async () => {
    if (!selectedProject) return;
    try {
      setLoading(true);
      const response = await getSprints(selectedProject);
      setSprints(response.data);
    } catch (error) {
      console.error('Error fetching sprints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskStats = async () => {
    if (!selectedProject) return;
    try {
      const backlogResponse = await getTasks({ projectId: selectedProject, status: 'Backlog' });
      const todoResponse = await getTasks({ projectId: selectedProject, status: 'To Do' });
      const inProgressResponse = await getTasks({ projectId: selectedProject, status: 'In Progress' });
      const inReviewResponse = await getTasks({ projectId: selectedProject, status: 'In Review' });
      const doneResponse = await getTasks({ projectId: selectedProject, status: 'Done' });
      
      setTaskStats({
        backlog: backlogResponse.data.length,
        todo: todoResponse.data.length,
        inProgress: inProgressResponse.data.length,
        inReview: inReviewResponse.data.length,
        done: doneResponse.data.length,
        total: backlogResponse.data.length + todoResponse.data.length + 
               inProgressResponse.data.length + inReviewResponse.data.length + 
               doneResponse.data.length
      });
    } catch (error) {
      console.error('Error fetching task statistics:', error);
    }
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleSprintSaved = () => {
    setOpenSprintForm(false);
    fetchSprints();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Dashboard
        </Typography>
        
        <ProjectSelector
          selectedProject={selectedProject}
          onProjectChange={handleProjectChange}
        />
        
        {selectedProject && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Project Overview
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenSprintForm(true)}
              >
                Create Sprint
              </Button>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4} md={2}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Tasks
                    </Typography>
                    <Typography variant="h4">{taskStats.total || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Backlog
                    </Typography>
                    <Typography variant="h4">{taskStats.backlog || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      To Do
                    </Typography>
                    <Typography variant="h4">{taskStats.todo || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      In Progress
                    </Typography>
                    <Typography variant="h4">{taskStats.inProgress || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      In Review
                    </Typography>
                    <Typography variant="h4">{taskStats.inReview || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Done
                    </Typography>
                    <Typography variant="h4">{taskStats.done || 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Sprints
            </Typography>
            
            {sprints.length > 0 ? (
              <Grid container spacing={3}>
                {sprints.map((sprint) => (
                  <Grid item xs={12} sm={6} md={4} key={sprint._id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6">{sprint.name}</Typography>
                          {sprint.isActive && (
                            <Chip label="Active" color="success" size="small" />
                          )}
                        </Box>
                        
                        <Typography color="textSecondary" variant="body2" gutterBottom>
                          {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                        </Typography>
                        
                        <Button
                          component={RouterLink}
                          to={`/sprint/${sprint._id}`}
                          variant="outlined"
                          size="small"
                          sx={{ mt: 2 }}
                        >
                          View Board
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No sprints yet. Create your first sprint to get started.
              </Typography>
            )}
            
            <Button
              component={RouterLink}
              to="/backlog"
              variant="contained"
              color="secondary"
              sx={{ mt: 4 }}
            >
              View Backlog
            </Button>
            
            <AddSprintForm
              open={openSprintForm}
              onClose={() => setOpenSprintForm(false)}
              onSave={handleSprintSaved}
              projectId={selectedProject}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
