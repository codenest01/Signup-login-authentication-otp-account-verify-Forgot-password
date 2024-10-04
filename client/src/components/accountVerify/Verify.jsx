import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/accountVerify/Verify.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Verify() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(0);
  const [isResendAllowed, setIsResendAllowed] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isFirstAttempt, setIsFirstAttempt] = useState(true); // Track if it's the first attempt
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('verifyTokenEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error('No verification token found. Please log in again.');
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setOtp(value);
    if (value.length > 6) {
      setOtp(value.slice(0, 6)); // Corrected line
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Email:', email, 'OTP:', otp);
    
    setIsLoading(true);

    // Delay for 2 seconds before verifying
    setTimeout(async () => {
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
      } finally {
        setIsLoading(false); // Reset loading state after request
      }
    }, 2000); // 2-second delay
  };

  const handleSendCode = async () => {
    setIsResending(true);
    
    // Delay for 2 seconds before sending
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:5000/verify', { email });
        toast.success('A new verification code has been sent!');
        setIsResendAllowed(false);
        setTimer(30);
        setIsOtpSent(true);
        setIsFirstAttempt(false); // Update the flag to indicate the first attempt is done
      } catch (error) {
        toast.error('Failed to resend code. Please try again.');
      } finally {
        setIsResending(false); // Reset loading state after request
      }
    }, 2000); // 2-second delay
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

        {isOtpSent && ( // Conditionally render OTP input field
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
        )}
        
        {isOtpSent && ( // Conditionally render the Verify button
          <button type="submit" className={styles.submitButton} disabled={isVerified || isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        )}
        
        <button
          type="button"
          className={styles.sendCodeButton}
          onClick={handleSendCode}
          disabled={!isResendAllowed || isResending}
        >
          {isResending 
            ? (isFirstAttempt ? 'Sending code...' : 'Resending code...') 
            : (isFirstAttempt ? 'Send code' : 'Resend code')}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Verify;
