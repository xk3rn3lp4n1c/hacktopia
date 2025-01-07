"use client";

import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import CreateAccount from "./pages/auth/CreateAccount";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Index from "./pages";
import AppLayout from "./pages/AppLayout";
import AuthCallback from "./pages/auth/Callback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ResetPassword from "./pages/auth/ResetPassword";
import TeamLayout from "./pages/team/TeamLayout";
import Teams from "./pages/team/Teams";
import TeamDetail from "./pages/team/TeamDetail";
import MyTeam from "./pages/team/MyTeam";
import { socketServer } from "./lib/utils";
import { setTeam } from "./redux/features/team/teamSlice";
import MyTeamSettings from "./pages/team/MyTeamSettings";

export default function App() {
  const [cookies, _] = useCookies(["token"]);
  const { token, userId } = useAppSelector((state) => state.auth);
  const [authenticated, setAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = () => {
      if (cookies.token && cookies.token === token) {
        setAuthenticated(true);
        setIsLoading(false);
      } else {
        setAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [cookies.token, token, authenticated]);

  useEffect(() => {
    socketServer.on("requestJoinAccepted", (data) => {
      console.log("From APP: ", data);

      if (data) {
        if (data.teamMember.userId === userId) {
          appDispatch(setTeam(data.teamName));
        }
      }
    });

    return () => {
      socketServer.off("requestJoinAccepted");
    };
  }, [socketServer]);

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
            <Route path="*" element={<Navigate to="/" />} />
            <Route index element={<Index />} />
            <Route path="/" element={<Index />} />
            <Route path="team" element={<MyTeam />} />
            <Route path="team/settings" element={<MyTeamSettings />} />
            <Route
              path="teams"
              element={
                <TeamLayout>
                  <Outlet />
                </TeamLayout>
              }
            >
              <Route index element={<Teams />} />
              <Route path="overview/:teamId" element={<TeamDetail />} />
            </Route>
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
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-otp" element={<VerifyOTP />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        )}
      </Routes>
    </>
  );
}
