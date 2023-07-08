import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { NavLink, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';
import UpdateEmployeeForm from './UpdateEmployeeForm';
import AdminNavbar from './AdminNavbar';
import './Admin.css';

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRemoveEmployee = (employeeId) => {
    // Remove the employee with the given ID
    axios.delete(`/employees/${employeeId}`)
      .then((response) => {
        console.log(response.data.message);
        // Remove the employee from the local state
        setEmployees(employees.filter((employee) => employee._id !== employeeId));
      })
      .catch((error) => {
        console.error('Error removing employee:', error);
      });
  };

  const handleUpdateEmployee = (employee) => {
    // Set the selected employee and open the update dialog
    setSelectedEmployee(employee);
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    // Close the update dialog
    setUpdateDialogOpen(false);
  };

  useEffect(() => {
    // Fetch employees data from the server
    axios.get('/admin/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  return (
    <div className="admin-container">
      <AdminNavbar/>
      <div>
        <Button variant="contained" onClick={handleOpenDialog}>
          Add Employee
        </Button>
  
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogContent>
            <EmployeeForm onClose={handleCloseDialog} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <h3>Employee List:</h3>
        {employees.map((employee) => (
          <div className="card" key={employee._id}>
            <div className="card-header">
              <h4>{employee.name}</h4>
              <div className="card-buttons">
                <button className="button remove" onClick={() => handleRemoveEmployee(employee._id)}>Remove</button>
                <button className="button update" onClick={() => handleUpdateEmployee(employee)}>Update</button>
              </div>
            </div>
            <div className="card-content">
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Role:</strong> {employee.role}</p>
            </div>
          </div>
        ))}
        {selectedEmployee && (
          <UpdateEmployeeForm
            open={isUpdateDialogOpen}
            onClose={handleCloseUpdateDialog}
            employee={selectedEmployee}
          />
        )}
      </div>
    </div>
  );
  
};

export default Admin;
