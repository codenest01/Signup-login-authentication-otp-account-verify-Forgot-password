import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Verify.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Verify() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(0);
  const [isResendAllowed, setIsResendAllowed] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Track verification success

  useEffect(() => {
    const storedEmail = localStorage.getItem('verifyTokenEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error('No verification token found. Please log in again.');
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase for consistency
    setOtp(value);
    if (value.length > 6) {
      setOtp(value.slice(0, 6)); // Limit to 6 characters
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Email:', email, 'OTP:', otp);
    
    try {
      const response = await axios.post('http://localhost:5000/verify-code', { email, otp });
      toast.success('Verification successful!');

  
  
      localStorage.removeItem('verifyToken');
      localStorage.removeItem('verifyTokenEmail'); 
  
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      
    } catch (error) {
      toast.error('Verification failed. Please check your OTP and try again.');
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  
  


  const handleSendCode = async () => {
    try {
      await axios.post('http://localhost:5000/verify', { email });
      toast.success('A new verification code has been sent!');
      setIsResendAllowed(false);
      setTimer(30);
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendAllowed(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verify Your Account</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={email}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="otp" className={styles.label}>Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            className={styles.input}
            value={otp}
            onChange={handleChange}
            required
            maxLength="6"
            pattern="[A-Za-z0-9]{6}"
            placeholder="Enter OTP"
          />
          <span className={styles.error}>{otp.length !== 6 && otp ? 'OTP must be 6 characters.' : ''}</span>


        </div>
        <button type="submit" className={styles.submitButton} disabled={isVerified}>
          Verify
        </button>
        <button
          type="button"
          className={styles.sendCodeButton}
          onClick={handleSendCode}
          disabled={!isResendAllowed}
        >
          {isResendAllowed ? 'Send code' : `Wait ${timer}s`}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Verify;