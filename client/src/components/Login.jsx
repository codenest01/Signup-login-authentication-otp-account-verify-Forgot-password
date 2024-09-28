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
        
      const { token, email, username } = response.data;
  
      // Store token and user details in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
  
      setTimeout(() => {
        navigate('/home'); // Redirect to home page or another route
      }, 2000);
  
    } catch (error) {
      if (error.response && error.response.data) {
        const { error: generalError, redirectTo, verifyToken, verifyTokenEmail } = error.response.data;
  
        // If the user is not verified, store verifyToken and email in local storage
        if (verifyToken && verifyTokenEmail) {
          localStorage.setItem('verifyToken', verifyToken);
          localStorage.setItem('verifyTokenEmail', verifyTokenEmail);
          toast.info('Please verify your account.');
          navigate('/verify');  // Redirect to the verification page
        } else {
          toast.error(generalError || 'Login failed. Please try again.');
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
      <li>Forget password? <a href="/requestotp">Forget</a></li>

      <ToastContainer />
    </div>
  );
}

export default Login;
