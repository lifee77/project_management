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
      const response = await getSprints(selectedProject);
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
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Backlog
        </Typography>
        
        <ProjectSelector
          selectedProject={selectedProject}
          onProjectChange={handleProjectChange}
        />
        
        {selectedProject && (
          <BacklogList 
            projectId={selectedProject} 
            sprints={sprints}
            onTaskAdded={fetchSprints}
          />
        )}
      </Box>
    </Container>
  );
};

export default BacklogView;
