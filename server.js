const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcrypt');

const app = express();

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/review-system',
  collection: 'sessions',
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

mongoose.connect('mongodb://localhost:27017/review-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], required: true },
    canGiveReview: { type: Boolean, default: false },
  });

const ReviewSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  feedback: { type: String, required: true },
});

const Review = mongoose.model('Review', ReviewSchema);

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', UserSchema);

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, username, password: hashedPassword, role: 'employee', canGiveReview: false });
    await user.save();

    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      canGiveReview: user.canGiveReview,
    };

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incorrect password
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store user information in the session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Redirect based on user role
    let redirectTo = '';
    if (user.role === 'admin') {
      redirectTo = '/admin';
    } else if (user.role === 'employee') {
      redirectTo = '/home';
    } else {
      // Invalid role
      return res.status(403).json({ error: 'Invalid role' });
    }

    // Authentication successful
    res.json({ message: 'Login successful', redirectTo });

  } catch (error) {
    console.error('Login error:', error);
    // Handle authentication error
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/logout', (req, res) => {
  // Clear user session (using express-session)
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logout successful' });
    }
  });
});

app.get('/admin/employees', async (req, res) => {
  try {
    // Fetch all employees from the database
    const employees = await User.find({ role: 'employee' });

    // Send the employees as a response
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create an employee
app.post('/employees', async (req, res) => {
  // Check if user is admin
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { name, email, username, role, password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const employee = new User({ name, email, username, role, password: hashedPassword });
    await employee.save();
    res.json({ message: 'Employee created successfully', employee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an employee
app.put('/employees/:id', async (req, res) => {
  // Check if user is admin
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { name, email, role } = req.body;
  const { id } = req.params;

  try {
    const employee = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  // Check if user is admin
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { id } = req.params;

  try {
    const employee = await User.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/reviews', async (req, res) => {
  const { employee, feedback } = req.body;

  try {
    const review = new Review({ employeeId: employee, feedback });
    await review.save();
    res.json({ message: 'Review submitted successfully', reviewId: review._id });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/admin/reviews', async (req, res) => {
  try {
    // Fetch all reviews from the database
    const reviews = await Review.find();

    // Fetch the reviewer's name and the name of the employee who has been reviewed
    const populatedReviews = await Promise.all(reviews.map(async (review) => {
      const { employeeId, reviewerId, feedback } = review;

      const employee = await User.findById(employeeId);
      const reviewer = await User.findById(reviewerId);

      const reviewerName = reviewer ? reviewer.name : 'Unknown';
      const reviewedEmployeeName = employee ? employee.name : 'Unknown';

      return {
        reviewerName,
        reviewedEmployeeName,
        feedback,
      };
    }));

    res.json(populatedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;

  try {
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.feedback = feedback;
    await review.save();

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/access', async (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { id } = req.session.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const canGiveReview = user.canGiveReview || false;

    res.json({ canGiveReview });
  } catch (error) {
    console.error('Error fetching access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.put('/employees/:id/access', async (req, res) => {
  // Check if user is admin
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { id } = req.params;
  const { canGiveReview } = req.body;

  try {
    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.canGiveReview = canGiveReview; // Set the canGiveReview flag to the provided value
    await employee.save();

    res.json({ message: 'Access updated successfully' });
  } catch (error) {
    console.error('Error updating access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
