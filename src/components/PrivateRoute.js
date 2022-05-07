import React, { useEffect, useState } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  const [user, setUser] = useState("");

  useEffect(() => {
    const User =
      localStorage.getItem("gdrive-user") !== "undefined"
        ? setUser(JSON.parse(localStorage.getItem("gdrive-user")))
        : localStorage.clear();

    //if (!User) navigate("/login");
  }, []);

  return currentUser?.uid || user.id ? (
    <Outlet />
  ) : (
    <Navigate replace to="/login" />
  );
}
