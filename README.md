# Project Management Tool

A full-stack project management application with Kanban board, sprint planning, and backlog management.

## Features

- Project dashboard with overview statistics
- Sprint planning and management
- Kanban board for visualizing task progress
- Backlog management
- Drag and drop task management
- Priority and status tracking

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- RESTful API design

### Frontend
- React with TypeScript
- Material UI for components
- React Router for navigation
- React Beautiful DND for drag-and-drop functionality
- Axios for API requests

## Installation

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas)

### Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your MongoDB connection string
# Example: MONGO_URI=mongodb://localhost:27017/project_management
# PORT=5000

# Start development server
npm run dev
```

### Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Usage

1. Create a new project from the dashboard
2. Create sprints for your project
3. Add tasks to the backlog
4. Move tasks to sprints when ready
5. Use the Kanban board to track task progress

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Sprints
- `GET /api/sprints` - Get all sprints
- `GET /api/sprints/:id` - Get a specific sprint
- `POST /api/sprints` - Create a new sprint
- `PUT /api/sprints/:id` - Update a sprint
- `DELETE /api/sprints/:id` - Delete a sprint

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/backlog` - Get backlog tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
