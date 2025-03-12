import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { createSprint } from '../services/api';

interface AddSprintFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  projectId: string;
}

const AddSprintForm: React.FC<AddSprintFormProps> = ({ 
  open, 
  onClose, 
  onSave,
  projectId 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: 'false' // Changed to string for compatibility with MUI
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Sprint name is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createSprint({
        ...formData,
        project: projectId,
        isActive: formData.isActive === 'true' // Convert back to boolean for API
      });
      onSave();
      resetForm();
    } catch (error) {
      console.error('Error creating sprint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      isActive: 'false'
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Sprint</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Sprint Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleTextFieldChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.startDate}
              onChange={handleTextFieldChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.endDate}
              onChange={handleTextFieldChange}
              error={!!errors.endDate}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="active-status-label">Status</InputLabel>
              <Select
                labelId="active-status-label"
                id="active-status"
                name="isActive"
                value={formData.isActive}
                label="Status"
                onChange={handleSelectChange}
              >
                <MenuItem value="false">Inactive</MenuItem>
                <MenuItem value="true">Active</MenuItem>
              </Select>
              <FormHelperText>Set to active if this is the current sprint</FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Sprint'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddSprintForm;
