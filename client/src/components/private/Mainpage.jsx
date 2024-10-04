import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import styles from '../../styles/private/Mainpage.module.css'; // Adjust the path as needed

function Mainpage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/user-data', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(response.data);
        } catch (error) {
          toast.error('Failed to fetch user data');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const logoutHandle = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    setUserData(null);
    toast.success('You have successfully logged out!');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Main Dashboard</h1>
        <button onClick={logoutHandle} className={styles.logoutButton}>Logout</button>
      </header>

      <div className={styles.userInfoCard}>
        {userData ? (
          <>
            <h2>Welcome, {userData.username}!</h2>
            <p>Email: {userData.email}</p>
          </>
        ) : (
          <p>No user is logged in.</p>
        )}
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default Mainpage;
