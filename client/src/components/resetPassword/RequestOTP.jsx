import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/resetPassword/RequestOtp.module.css';

const RequestOTP = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      setMessage(response.data.message);
      setError('');

      // Store the email in localStorage for use in the ResetPassword page
      localStorage.setItem('reset-Pass-Token', response.data.token);

      // Navigate to the reset password page
      navigate('/resetpassword');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.title}>Forgot Password</h2>
        <form onSubmit={handleRequestOTP} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Requesting OTP...' : 'Request OTP'}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default RequestOTP;
