import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Paper, Typography, Grid } from '@mui/material';
import TaskCard from './TaskCard';
import { getTasks, updateTask } from '../services/api';

const columns = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'In Review', title: 'In Review' },
  { id: 'Done', title: 'Done' }
];

interface KanbanBoardProps {
  sprintId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ sprintId }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getTasks({ sprintId, status: { $ne: 'Backlog' } });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [sprintId]);

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find task that was dragged
    const task = tasks.find(t => t._id === draggableId);
    if (!task) return;

    // Update task locally first for optimistic UI
    const updatedTask = { ...task, status: destination.droppableId };
    setTasks(tasks.map(t => t._id === draggableId ? updatedTask : t));

    // Then update in the backend
    try {
      await updateTask(draggableId, { status: destination.droppableId });
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert to original state if there was an error
      setTasks(tasks);
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {columns.map(column => (
          <Grid item xs={12} sm={6} md={3} key={column.id}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: '#f5f5f5',
                height: '100%',
                minHeight: 500
              }}
            >
              <Typography variant="h6" gutterBottom>
                {column.title} ({getTasksByStatus(column.id).length})
              </Typography>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: 400 }}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2 }}
                          >
                            <TaskCard task={task} />
                          </Box>
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
