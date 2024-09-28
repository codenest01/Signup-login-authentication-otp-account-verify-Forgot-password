import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import styles from '../../styles/RequestOtp.module.css';

const RequestOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      setMessage(response.data.message);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.response.data.error || 'Something went wrong');
      setMessage('');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      setMessage(response.data.message);
      setError('');

      // Store the token and email in local storage
      localStorage.setItem('reset-Pass-Token', response.data.token);

      navigate('/resetpassword', { state: { email } });
    } catch (err) {
      setError(err.response.data.error || 'Invalid OTP or something went wrong');
      setMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>
      <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={otpSent}
          className={styles.input}
        />
        {otpSent && (
          <>
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className={styles.input}
            />
          </>
        )}
        <button type="submit" className={`${styles.button} mt-3`}>
          {otpSent ? 'Verify OTP' : 'Request OTP'}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default RequestOTP;