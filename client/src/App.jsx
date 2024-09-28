import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from "./components/Home";
import Mainpage from './components/private/Mainpage';
import Signup from './components/Signup';
import Login from "./components/Login";
import Verify from './components/private/Verify';
import RequestOtp from './components/private/RequestOTP';
import ResetPassword from './components/private/ResetPassword';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import ErrorPage from './components/ErrorPage'; 
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import RefreshHandler from './RefreshHandler';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token directly in the PrivateRoute
  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
  };

  const VerificationRoute = ({ element }) => {
    const verifyToken = localStorage.getItem('verifyToken');
    return verifyToken ? element : <Navigate to="/login" />;
};

const ResetPassToken = ({ element }) => {
  const ResetToken = localStorage.getItem('reset-Pass-Token');
  return ResetToken ? element : <Navigate to="/login" />;
};


  return (
    <BrowserRouter>
      <Header />
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />


        <Route path="/home" element={<PrivateRoute element={<Mainpage />} />} />
        <Route path="/verify" element={<VerificationRoute element={<Verify />} />} />

        <Route path="/requestotp" element={<RequestOtp />} />
        <Route path="/resetpassword" element={<ResetPassToken element={<ResetPassword />} />} />


        <Route path="/" element={<Home />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
