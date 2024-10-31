import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext, AuthProvider } from './Auth';
import Login from './Components/Login';
import Register from './Components/Register';
import Exam from './Components/Exam';
import Logout from './Components/Logout';
import ProtectedRoute from './Components/ProtectedRoute';
import NoAccess from './Components/NoAccess';

function App() {
  const [user, setUser] = useState(null); // Track logged-in user

  return (
    <AuthProvider>
      <Router>
        <Main user={user} setUser={setUser} />
      </Router>
    </AuthProvider>
  );
}

function Main({ user, setUser }) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/no-access" element={<NoAccess />} />
          <Route path="/exam" element={<ProtectedRoute user={user} element={<Exam />} />} />
          <Route path="/logout" element={<Logout setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;