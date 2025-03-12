import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper, 
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getBacklogTasks, updateTask } from '../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee?: string;
}

interface BacklogListProps {
  projectId: string;
  sprints: any[];
  onTaskUpdate?: () => void;
}

const BacklogList: React.FC<BacklogListProps> = ({ projectId, sprints, onTaskUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchBacklogTasks();
    }
  }, [projectId]);

  const fetchBacklogTasks = async () => {
    try {
      setLoading(true);
      const response = await getBacklogTasks(projectId);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching backlog tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleMoveToSprint = async (sprintId: string) => {
    if (!selectedTask) return;
    
    try {
      await updateTask(selectedTask, { sprintId });
      if (onTaskUpdate) {
        onTaskUpdate();
      }
      fetchBacklogTasks();
    } catch (error) {
      console.error('Error moving task to sprint:', error);
    } finally {
      handleMenuClose();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading && projectId) {
    return <Typography>Loading backlog tasks...</Typography>;
  }

  if (tasks.length === 0 && !loading) {
    return <Typography>No tasks in backlog</Typography>;
  }

  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Backlog Items
      </Typography>
      <List>
        {tasks.map(task => (
          <ListItem 
            key={task._id}
            sx={{ 
              mb: 1, 
              borderLeft: '4px solid',
              borderLeftColor: 'primary.main',
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'action.hover' }
            }}
            secondaryAction={
              <IconButton 
                edge="end" 
                onClick={(e) => handleMenuOpen(e, task._id)}
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={task.title}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" component="span">
                    {task.description?.substring(0, 100)}
                    {task.description?.length > 100 ? '...' : ''}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={task.priority} 
                      size="small" 
                      color={getPriorityColor(task.priority) as any}
                      sx={{ mr: 1 }}
                    />
                    {task.assignee && (
                      <Chip label={`Assigned to: ${task.assignee}`} size="small" />
                    )}
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>Move to sprint</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        {sprints.map(sprint => (
          <MenuItem 
            key={sprint._id} 
            onClick={() => handleMoveToSprint(sprint._id)}
          >
            {sprint.name}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default BacklogList;
