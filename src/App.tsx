"use client";

import { Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import CreateAccount from "./pages/auth/CreateAccount";
import { useAppSelector } from "./redux/hooks";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Index from "./pages";
import AppLayout from "./pages/AppLayout";
import AuthCallback from "./pages/auth/Callback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";

export default function App() {
  const [cookies, _] = useCookies(["token"]);
  const { token } = useAppSelector((state) => state.auth);
  const [authenticated, setAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      if (cookies.token && cookies.token === token) {
        setAuthenticated(true);
        setIsLoading(false);
        navigate("/");
      } else {
        setAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [cookies.token, token, authenticated]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Routes>
        {authenticated ? (
          <Route
            path="/"
            element={
              <AppLayout>
                <Outlet />
              </AppLayout>
            }
          >
            <Route index element={<Index />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          <Route
            path="/"
            element={
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            }
          >
            <Route
              index
              element={<Login setAuthenticated={setAuthenticated} />}
            />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route
              path="login"
              element={<Login setAuthenticated={setAuthenticated} />}
            />
            <Route
              path="register"
              element={<CreateAccount setAuthenticated={setAuthenticated} />}
            />
            <Route
              path="forgot-password"
              element={<ForgotPassword />}
            />
            <Route
              path="verify-otp"
              element={<VerifyOTP />}
            />
             <Route
              path="reset-password"
              element={<ResetPassword />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        )}
      </Routes>
    </>
  );
}
