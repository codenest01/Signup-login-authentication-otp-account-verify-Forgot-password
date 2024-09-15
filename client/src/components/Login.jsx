import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Login.module.css'; // Update with your styles path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Login() {
  const [formData, setFormData] = useState({
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
      const response = await axios.post('http://localhost:5000/login', formData);
      toast.success('Login successful!');
      
      const { token, email ,username } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);

      setTimeout(() => {
        navigate('/home'); // Redirect to home page or another route
      }, 2000);
    
    } catch (error) {
      if (error.response && error.response.data) {
        const { errors, error: generalError } = error.response.data;

        if (errors) {
          errors.forEach(err => toast.error(err.msg)); // Display each error message
        } else if (generalError) {
          toast.error(generalError);
        }
      } else {
        toast.error('Login failed. Please try again.');
      }
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
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
        <button type="submit" className={styles.submitButton}>Log In</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
