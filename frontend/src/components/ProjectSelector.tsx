import React, { useState, useEffect } from 'react';
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box
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

    fetchProjects();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth disabled={loading}>
        <InputLabel id="project-select-label">Project</InputLabel>
        <Select
          labelId="project-select-label"
          id="project-select"
          value={value}
          label="Project"
          onChange={handleChange}
        >
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
