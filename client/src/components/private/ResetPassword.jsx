import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/ResetPassword.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve JWT token from localStorage
      const token = localStorage.getItem('reset-Pass-Token');
      if (!token) {
        setError('No reset token found. Please request a password reset again.');
        return;
      }

      // Make the request to reset the password
      const response = await axios.post('http://localhost:5000/reset-password', { newPassword }, {
        headers: {
          Authorization: `Bearer ${token}`  // Send token in Authorization header
        }
      });

      setMessage(response.data.message); // Display success message
      localStorage.removeItem('reset-Pass-Token'); // Optionally clear the token after success
      setNewPassword(''); 
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while resetting the password.');
      setMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
}

export default ResetPassword;