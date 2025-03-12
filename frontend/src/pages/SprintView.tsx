import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import KanbanBoard from '../components/KanbanBoard';
import AddTaskForm from '../components/AddTaskForm';
import { getSprint } from '../services/api';

const SprintView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sprint, setSprint] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchSprint(id);
    }
  }, [id]);

  const fetchSprint = async (sprintId: string) => {
    try {
      setLoading(true);
      const response = await getSprint(sprintId);
      setSprint(response.data);
    } catch (error) {
      console.error('Error fetching sprint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSaved = () => {
    setShowAddForm(false);
    // Refresh board data
    if (id) {
      fetchSprint(id);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading sprint...</Typography>
      </Container>
    );
  }

  if (!sprint) {
    return (
      <Container>
        <Typography>Sprint not found</Typography>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </Container>
    );
  }

  const { name, startDate, endDate, isActive, project } = sprint;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/')} 
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" component="h1" display="inline">
              {name}
            </Typography>
            {isActive && (
              <Chip 
                label="Active" 
                color="success" 
                size="small" 
                sx={{ ml: 2 }}
              />
            )}
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setShowAddForm(true)}
            >
              Add Task
            </Button>
          </Grid>
        </Grid>

        <Typography color="textSecondary" sx={{ mt: 1 }}>
          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Project: {project?.name || 'Unknown Project'}
        </Typography>
      </Box>

      <KanbanBoard sprintId={id || ''} />

      <AddTaskForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleTaskSaved}
        projectId={project?._id}
        sprintId={id}
      />
    </Container>
  );
};

export default SprintView;
