import { authenticate } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback = () => {
  const [_, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const location = useLocation();

  const appDispactch = useAppDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      setCookie("token", token, { path: "/" });

      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      appDispactch(
        authenticate({
          token,
          email: decodedToken.email,
          userName: decodedToken.userName,
          userId: decodedToken.userId,
        })
      );
      navigate("/"); // Redirect to home or any other page
    } else {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [location, navigate, setCookie]);

  return null;
};

export default AuthCallback;
