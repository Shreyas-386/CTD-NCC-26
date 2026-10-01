import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../auth/auth";

const PublicRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setAuth(loggedIn);
    };
    checkAuth();
  }, []);

  if (auth === null) return <div>Loading...</div>;

  // If user is logged in, redirect to dashboard (or any protected route)
  // if (auth) return <Navigate to="/instructions" replace />;

  return <Outlet />; // otherwise, render public route (login, signup)
};

export default PublicRoute;
