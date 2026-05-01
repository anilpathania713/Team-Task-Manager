import { useState } from "react"; // <-- Import useState
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Navbar from "./Navbar/Navbar";


function MainLayout({ children, setIsLoggedIn }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setIsLoggedIn={setIsLoggedIn} /> {/* Pass setter to Navbar */}
      <main>{children}</main>
    </div>
  );
}

function App() {
  // Check if token exists on initial load
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/signup" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <MainLayout setIsLoggedIn={setIsLoggedIn}><Dashboard /></MainLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/projects"
          element={
            isLoggedIn ? (
              <MainLayout setIsLoggedIn={setIsLoggedIn}><Projects /></MainLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;