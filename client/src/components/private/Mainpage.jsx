import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

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
    // Clear token and user data
    localStorage.removeItem('token');
    setUserData(null);
    toast.success('You have successfully logged out!');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={logoutHandle}>Logout</button>
      <h1>Main Page</h1>
      {userData ? (
     <div>
         <p>Welcome, {userData.username}!</p>
         <p>Welcome, {userData.email}!</p>
         <p>Welcome, {userData._id}!</p>
     </div>
      ) : (
        <p>No user is logged in.</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default Mainpage;
