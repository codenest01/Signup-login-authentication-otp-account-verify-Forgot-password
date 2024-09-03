import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from "./components/Home";
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Profilepage from './components/ProtectedRoutes/Profilepage';
import ErrorPage from './components/ErrorPage'; // Import the error page component
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

const PrivateRoute = ({ element: Element }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.post('http://localhost:5000/validate-token', { token });
          if (response.data.valid) {
            setIsValid(true);
          } else {
            localStorage.removeItem('token');
            setIsValid(false);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setIsValid(false);
        }
      } else {
        setIsValid(false);
      }
    };

    checkToken();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isValid ? <Element /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<PrivateRoute element={Profilepage} />} />
        <Route path="*" element={<ErrorPage />} /> {/* Catch-all route for undefined pages */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
