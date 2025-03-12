import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { getTasks, updateTask } from '../services/api';

interface KanbanTask {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

interface KanbanBoardProps {
  sprintId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ sprintId }) => {
  const [columns, setColumns] = useState<Record<string, Column>>({
    todo: { id: 'todo', title: 'To Do', tasks: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', tasks: [] },
    review: { id: 'review', title: 'Review', tasks: [] },
    done: { id: 'done', title: 'Done', tasks: [] }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (sprintId) {
      fetchTasks();
    }
  }, [sprintId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks({ sprintId });
      
      // Group tasks by status
      const updatedColumns = { ...columns };
      
      // Reset tasks in all columns
      Object.keys(updatedColumns).forEach(colId => {
        updatedColumns[colId].tasks = [];
      });
      
      // Add tasks to appropriate columns
      response.data.forEach((task: KanbanTask) => {
        const status = task.status || 'todo';
        if (updatedColumns[status]) {
          updatedColumns[status].tasks.push(task);
        } else {
          updatedColumns.todo.tasks.push(task);
        }
      });
      
      setColumns(updatedColumns);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside a valid droppable
    if (!destination) return;
    
    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Get the source and destination columns
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    
    if (sourceColumn === destColumn) {
      // Moving within the same column
      const newTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      
      const newColumn = {
        ...sourceColumn,
        tasks: newTasks
      };
      
      setColumns({
        ...columns,
        [sourceColumn.id]: newColumn
      });
    } else {
      // Moving to a different column
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      
      // Update the task status to match the new column
      const updatedTask = { ...movedTask, status: destColumn.id };
      
      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, updatedTask);
      
      setColumns({
        ...columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destColumn.id]: {
          ...destColumn,
          tasks: destTasks
        }
      });
      
      // Update the task status in the backend
      try {
        await updateTask(draggableId, { status: destColumn.id });
      } catch (error) {
        console.error('Error updating task status:', error);
        // Revert the UI change on error
        fetchTasks();
      }
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

  if (loading) {
    return <Typography>Loading tasks...</Typography>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container spacing={2}>
        {Object.values(columns).map(column => (
          <Grid item xs={12} sm={6} md={3} key={column.id}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: 'background.default',
                height: '70vh',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  pb: 1,
                  mb: 1,
                  borderBottom: '2px solid',
                  borderBottomColor: theme => {
                    switch (column.id) {
                      case 'todo': return theme.palette.info.main;
                      case 'in-progress': return theme.palette.warning.main;
                      case 'review': return theme.palette.secondary.main;
                      case 'done': return theme.palette.success.main;
                      default: return theme.palette.primary.main;
                    }
                  }
                }}
              >
                {column.title} ({column.tasks.length})
              </Typography>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      flexGrow: 1,
                      minHeight: '100px',
                      overflowY: 'auto'
                    }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 2,
                              boxShadow: snapshot.isDragging ? 6 : 1,
                              '&:hover': {
                                boxShadow: 3
                              }
                            }}
                          >
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom>
                                {task.title}
                              </Typography>
                              
                              {task.description && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{
                                    mb: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                  }}
                                >
                                  {task.description}
                                </Typography>
                              )}
                              
                              <Divider sx={{ my: 1 }} />
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Chip 
                                  size="small" 
                                  label={task.priority}
                                  color={getPriorityColor(task.priority) as any}
                                />
                                {task.assignee && (
                                  <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                    {task.assignee}
                                  </Typography>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </DragDropContext>
  );
};

export default KanbanBoard;
