import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [canGiveReview, setCanGiveReview] = useState(false);

  useEffect(() => {
    // Fetch the employee list from the server
    axios.get('/admin/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employee list:', error);
      });

      axios.get('/access')
      .then(response => {
        setCanGiveReview(response.data.canGiveReview);
      })
      .catch(error => {
        console.error('Error fetching access information:', error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/logout');
      console.log(response.data.message);

      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee('');
    setReviewText('');
  };

  const handleEmployeeSelect = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    // Create a new review object
    const reviewData = {
      employee: selectedEmployee,
      feedback: reviewText,
    };

    // Submit the review to the server
    axios.post('/reviews', reviewData)
      .then(response => {
        console.log(response.data.message);
        // Reset the selected employee and review text
        setSelectedEmployee('');
        setReviewText('');
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
  };
  

  return (
    <div className="home-container"> {/* Add the container class */}
      <nav className="home-nav"> {/* Add the nav class */}
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
  
      {!canGiveReview && (
        <div className="home-message">
          <p>You don't have access to review other employees</p>
        </div>
      )}
  
      {canGiveReview && (
        <div className="home-review">
          <FormControl>
            <InputLabel id="employee-select-label">Select Employee</InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <TextField
            label="Review"
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button variant="contained" onClick={handleReviewSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
  
  
};

export default Navbar;
