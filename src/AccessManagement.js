import React, { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import './AccessManagement.css'

const AccessManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    // Fetch the list of employees from the server
    axios.get('/admin/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const handleGiveAccess = () => {
    // Send a request to the server to give access to the selected employee
    axios.put(`/employees/${selectedEmployee}/access`, { canGiveReview: true })
      .then(response => {
        console.log(selectedEmployee);
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error giving access:', error);
      });
  };

  const handleRemoveAccess = () => {
    // Send a request to the server to remove access for the selected employee
    axios.put(`/employees/${selectedEmployee}/access`, { canGiveReview: false })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error removing access:', error);
      });
  };

  return (
    <div className="access-management-container">
      <AdminNavbar />
      <h3 className="access-management-title">Access Management:</h3>
      <div className="access-management-form">
        <FormControl className="access-management-select">
        <Select
          labelId="employee-select-label"
          id="employee-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select an employee
          </MenuItem>
          {employees.map((employee) => (
            <MenuItem key={employee._id} value={employee._id}>{employee.name}</MenuItem>
          ))}
      </Select>
        </FormControl>
        <Button variant="contained" className="access-management-button" onClick={handleGiveAccess}>
          Give Access
        </Button>
        <Button variant="contained" className="access-management-button" onClick={handleRemoveAccess}>
          Remove Access
        </Button>
      </div>
    </div>
  );
};

export default AccessManagement;
