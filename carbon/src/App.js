// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/landing" /> : <Login />} 
        />
        <Route 
          path="/landing" 
          element={isLoggedIn ? <LandingPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn ? "/landing" : "/login"} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;