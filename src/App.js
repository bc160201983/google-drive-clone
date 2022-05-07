import Signup from "./components/auth/Signup";
import { Container } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Profile from "./components/auth/Profile";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import { useEffect } from "react";
import NotFound from "./components/NotFound";
import { useAuth } from "./Context";
import Dashboard from "./components/drive/Dashboard";

function App() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        <Route exact path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/folder/:folderId" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
