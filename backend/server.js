const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/project_management')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample API endpoints
app.get('/api/projects', async (req, res) => {
  try {
    // In a real app, you'd query your database
    res.json([
      { _id: '1', name: 'Project Alpha' },
      { _id: '2', name: 'Project Beta' },
      { _id: '3', name: 'Project Gamma' }
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sprints', async (req, res) => {
  try {
    // In a real app, you'd filter by project ID
    const projectId = req.query.project;
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    res.json([
      { 
        _id: '101', 
        name: 'Sprint 1', 
        startDate: '2023-01-01', 
        endDate: '2023-01-14',
        isActive: true,
        taskCount: 5,
        project: projectId 
      },
      { 
        _id: '102', 
        name: 'Sprint 2', 
        startDate: '2023-01-15', 
        endDate: '2023-01-28',
        isActive: false,
        taskCount: 3,
        project: projectId 
      }
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    // In a real app, you'd filter by sprint or project
    res.json([
      { 
        _id: '201', 
        title: 'Task 1', 
        description: 'Description for task 1',
        status: 'todo',
        priority: 'high',
        assignee: 'John Doe'
      },
      { 
        _id: '202', 
        title: 'Task 2', 
        description: 'Description for task 2',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Jane Smith'
      }
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks/backlog', async (req, res) => {
  try {
    // In a real app, you'd filter by project
    res.json([
      { 
        _id: '301', 
        title: 'Backlog Task 1', 
        description: 'Description for backlog task 1',
        status: 'todo',
        priority: 'high',
        assignee: 'John Doe'
      },
      { 
        _id: '302', 
        title: 'Backlog Task 2', 
        description: 'Description for backlog task 2',
        status: 'todo',
        priority: 'low'
      }
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create basic routes for remaining API endpoints
const defaultHandler = (req, res) => {
  res.status(200).json({ message: 'API endpoint not yet implemented' });
};

app.post('/api/projects', defaultHandler);
app.put('/api/projects/:id', defaultHandler);
app.delete('/api/projects/:id', defaultHandler);

app.post('/api/sprints', defaultHandler);
app.put('/api/sprints/:id', defaultHandler);
app.delete('/api/sprints/:id', defaultHandler);

app.post('/api/tasks', defaultHandler);
app.put('/api/tasks/:id', defaultHandler);
app.delete('/api/tasks/:id', defaultHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
} else {
  // For development, redirect root to API info
  app.get('/', (req, res) => {
    res.send(`
      <h1>Project Management API Server</h1>
      <p>API is running. Use endpoints like:</p>
      <ul>
        <li><a href="/api/projects">/api/projects</a></li>
        <li><a href="/api/sprints?project=1">/api/sprints?project=1</a></li>
        <li><a href="/api/tasks">/api/tasks</a></li>
      </ul>
      <p>For the frontend, visit: <a href="http://localhost:3000">http://localhost:3000</a></p>
    `);
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
