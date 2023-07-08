import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import './ReviewList.css'
import AdminNavbar from './AdminNavbar';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleOpenDialog = (review) => {
    setOpenDialog(true);
    setReviewText(review.feedback);
  
    // Retrieve the _id from the review
    const reviewId = review._id;
  
    setSelectedReview({ ...review, reviewId });
  };
  

  useEffect(() => {
    // Fetch the reviews from the server
    axios.get('/admin/reviews')
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });

      // Fetch the employees from the server
    axios.get('/admin/employees')
    .then(response => {
      setEmployees(response.data);
    })
    .catch(error => {
      console.error('Error fetching employees:', error);
    });
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee('');
    setReviewText('');
    setSelectedReview(null);
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

  const handleReviewUpdate = () => {
    const updatedReviewData = {
      feedback: reviewText,
    };
  
    axios.put(`/reviews/${selectedReview._id}`, updatedReviewData)
      .then(response => {
        console.log(response.data.message);
        handleCloseDialog();
      })
      .catch(error => {
        console.error('Error updating review:', error);
      });
  };

  return (
    <div className="review-list-container">
      <AdminNavbar/>
      <h3>Review List:</h3>
      {reviews.map((review) => (
        <div className="review-card" key={review._id}>
          <div className="review-card-header">
            <div>
              <Button variant="outlined" onClick={() => handleOpenDialog(review)}>Update Review</Button>
            </div>
          </div>
          <p>Reviewed Employee: {review.reviewedEmployeeName}</p>
          <p>Review: {review.feedback}</p>
        </div>
      ))}
      <Button variant="contained" onClick={handleOpenDialog}>Add Review</Button>
      <Dialog open={openDialog} onClose={handleCloseDialog} className="review-dialog">
        <DialogTitle>{selectedReview ? 'Update Review' : 'Add Review'}</DialogTitle>
        <DialogContent>
          <FormControl>
            <InputLabel id="employee-select-label">Select Employee</InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>{employee.name}</MenuItem>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          
            <Button onClick={handleReviewSubmit}>Submit</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
  
};

export default ReviewList;
