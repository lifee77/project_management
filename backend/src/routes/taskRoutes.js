const express = require('express');
const router = express.Router();

// GET all tasks
router.get('/', (req, res) => {
  res.send('List all tasks');
});

// GET backlog tasks
router.get('/backlog', (req, res) => {
  res.send('List backlog tasks');
});

// GET a specific task
router.get('/:id', (req, res) => {
  res.send(`Task with ID: ${req.params.id}`);
});

// POST create a new task
router.post('/', (req, res) => {
  res.send('Create new task');
});

// PUT update an existing task
router.put('/:id', (req, res) => {
  res.send(`Update task with ID: ${req.params.id}`);
});

// DELETE remove a task
router.delete('/:id', (req, res) => {
  res.send(`Delete task with ID: ${req.params.id}`);
});

module.exports = router;