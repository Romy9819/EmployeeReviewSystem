import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Admin from './Admin';
import ReviewList from './ReviewList';
import AccessManagement from './AccessManagement';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin/>} />
        <Route path='/admin/reviews' element={<ReviewList/>} />
        <Route path='/admin/access' element={<AccessManagement/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
