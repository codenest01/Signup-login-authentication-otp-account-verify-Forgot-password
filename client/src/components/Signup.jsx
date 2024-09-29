import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Signup.module.css';
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
      console.log('Response:', response.data);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        const { errors, error: generalError } = error.response.data;

        if (errors) {
          // Show validation errors from backend
          errors.forEach(err => toast.error(err.msg)); // Display each error message
        } else if (generalError) {
          // Show general errors
          toast.error(generalError);
        }
      } else {
        // Network or unexpected error
        toast.error('Signup failed. Please try again.');
      }
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Signup</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className={styles.input}
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Sign Up</button>

        <div className='mt-3 d-flex justify-content-center align-item-center'>
          Already have an account? <a href="/login">Login</a>
        </div>

      </form>

      <ToastContainer />
    </div>
  );
}

export default Signup;
