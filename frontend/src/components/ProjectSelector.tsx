import React, { useState, useEffect } from 'react';
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { getProjects } from '../services/api';

interface Project {
  _id: string;
  name: string;
}

interface ProjectSelectorProps {
  value: string;
  onChange: (projectId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ value, onChange }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <Typography variant="body2">Loading projects...</Typography>
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No projects found. Create your first project using the "New Project" button.
      </Typography>
    );
  }

  return (
    <Box sx={{ minWidth: 250 }}>
      <FormControl fullWidth>
        <InputLabel id="project-select-label">Select Project</InputLabel>
        <Select
          labelId="project-select-label"
          id="project-select"
          value={value}
          label="Select Project"
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select a project</em>
          </MenuItem>
          {projects.map((project) => (
            <MenuItem key={project._id} value={project._id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProjectSelector;
