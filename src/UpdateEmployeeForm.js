import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import axios from 'axios';

const UpdateEmployeeForm = ({ open, onClose, employee }) => {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [role, setRole] = useState(employee.role);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setRole(employee.role);
    }
  }, [employee]);

  const handleSubmit = () => {

    if (!employee || !employee._id) {
        console.error('Invalid employee data');
        return;
      }

    const updatedEmployeeData = {
      _id: employee._id,
      name,
      email,
      role,
    };
  
    axios.put(`/employees/${employee._id}`, updatedEmployeeData)
      .then((response) => {
        console.log(response.data.message);
        // Close the dialog
        onClose();
      })
      .catch((error) => {
        console.error('Error updating employee:', error);
      });
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Employee</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Role:
            <input type="text" value={role} onChange={(event) => setRole(event.target.value)} />
          </label>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateEmployeeForm;
