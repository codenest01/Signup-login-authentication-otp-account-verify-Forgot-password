import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from "./components/Home";
import Mainpage from './components/Mainpage';
import Signup from './components/Signup';
import Login from "./components/Login";
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import ErrorPage from './components/ErrorPage'; 
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import RefreshHandler from './RefreshHandler';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Header />
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<PrivateRoute element={<Mainpage />} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
