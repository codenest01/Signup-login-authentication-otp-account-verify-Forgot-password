import React from 'react';
import styles from '../styles/Mainpage.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Mainpage() {
  // Retrieve the user's email and username from localStorage
  const userEmail = localStorage.getItem('email');
  const username = localStorage.getItem('username');

  const logoutHandle = () => {
    // Remove user data from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    
    // Show toast notification
    toast.success('You have successfully logged out!', {
      position: "top-right",
      autoClose: 2000, // Duration of toast display
    });
    
    // Redirect after a delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); // 2 seconds delay
  };

  return (
    <div className={styles.container}>
      <button className={styles.logoutButton} onClick={logoutHandle}>Logout</button>
      <h1 className={styles.title}>Main Page</h1>
      {userEmail ? (
        <p className={styles.message}>Welcome, {username ? `${username} (${userEmail})` : userEmail}!</p>
      ) : (
        <p className={styles.message}>No user is logged in.</p>
      )}

      <ToastContainer />
    </div>
  );
}

export default Mainpage;
