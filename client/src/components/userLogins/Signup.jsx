import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/userLogins/Signup.module.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      toast.success('Signup successful!');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        const { errors, error: generalError } = error.response.data;

        if (errors) {
          // Show validation errors from backend
          errors.forEach(err => toast.error(err.msg));
        } else if (generalError) {
          // Show general errors
          toast.error(generalError);
        }
      } else {
        toast.error('Signup failed. Please try again.');
      }
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.shape1}></div>
      <div className={styles.shape2}></div>
      <div className={styles.shape3}></div>

      <div className={styles.signupContainer}>
        <h2>Create Account</h2>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <label htmlFor="username">Full Name</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your full name"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
        </form>
        <div className={styles.loginLink}>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signup;
