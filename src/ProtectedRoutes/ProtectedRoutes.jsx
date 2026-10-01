import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../auth/auth";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
    //   console.log("Logged in ? : ", loggedIn);
      setAuth(loggedIn);
    };
    checkAuth();
  }, []);

  if (auth === null) return <div>Loading...</div>; // or spinner
  if (!auth) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
