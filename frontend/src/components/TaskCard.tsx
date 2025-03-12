import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const priorityColors = {
  Low: 'success',
  Medium: 'info',
  High: 'error'
} as const;

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { _id, title, description, priority, assignee } = task;

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ 
          height: 40, 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          mb: 1
        }}>
          {description || 'No description'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Chip 
            label={priority}
            size="small"
            color={priorityColors[priority as keyof typeof priorityColors]}
          />
          
          {assignee && (
            <Chip 
              label={assignee}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {(onEdit || onDelete) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(task)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" color="error" onClick={() => onDelete(_id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
