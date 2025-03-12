import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProjectSelector from '../components/ProjectSelector';
import BacklogList from '../components/BacklogList';
import { getSprints } from '../services/api';

const BacklogView = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [sprints, setSprints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProject) {
      fetchSprints();
    }
  }, [selectedProject]);

  const fetchSprints = async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      const response = await getSprints({ project: selectedProject });
      setSprints(response.data);
    } catch (error) {
      console.error('Error fetching sprints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Backlog
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <ProjectSelector 
          value={selectedProject}
          onChange={handleProjectChange}
        />
      </Box>
      
      {selectedProject ? (
        <BacklogList 
          projectId={selectedProject} 
          sprints={sprints} 
          onTaskUpdate={fetchSprints}
        />
      ) : (
        <Typography>Please select a project to view its backlog.</Typography>
      )}
    </Container>
  );
};

export default BacklogView;
