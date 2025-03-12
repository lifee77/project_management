const Sprint = require('../models/Sprint');

// Get all sprints
exports.getSprints = async (req, res) => {
  try {
    const { projectId } = req.query;
    const query = projectId ? { project: projectId } : {};
    
    const sprints = await Sprint.find(query).populate('project');
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single sprint
exports.getSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id).populate('project');
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create sprint
exports.createSprint = async (req, res) => {
  try {
    const sprint = new Sprint(req.body);
    const savedSprint = await sprint.save();
    res.status(201).json(savedSprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update sprint
exports.updateSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.json(sprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete sprint
exports.deleteSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findByIdAndDelete(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.json({ message: 'Sprint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
