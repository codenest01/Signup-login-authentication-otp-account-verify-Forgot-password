import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/ResetPassword.module.css';

function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve the reset JWT from localStorage
    const resetJwt = localStorage.getItem("reset-Pass-Token");

    if (!resetJwt) {
      toast.error('Reset token not found. Please request a new one.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        otp,
        newPassword,
      },{
        headers: {
          Authorization: `Bearer ${resetJwt}` // Correctly set resetJwt from localStorage
        }
      });

      // Show success message
      toast.success(response.data.msg || 'Password reset successfully!');
      console.log('Response:', response.data);

      // Clear reset token after successful password reset
      localStorage.removeItem("reset-Pass-Token");

      // Redirect to /login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      // Show error message
      toast.error(error.response?.data?.msg || 'Something went wrong!');
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.maincontainer}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-groups']}>
            <label htmlFor="otp">OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className={styles['form-groups']}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.rest-button}>Submit</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ResetPassword;
