"use server";

import { APP_API_ENDPOINT_URL } from "../api_endpoint";
import axios from "axios";

export const AuthLogin = async ({
  email_or_username = "",
  password = "",
}: {
  email_or_username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/auth/login`,
      {
        email_or_username,
        password,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AuthCreateAccount = async ({
  userName = "",
  email = "",
  password = "",
}: {
  userName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/auth/register`,
      {
        userName,
        email,
        password,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChkUsr = async ({ userName = "" }: { userName: string }) => {
  try {
    const response = await axios.get(
      `${APP_API_ENDPOINT_URL}/api/v1/auth/check-user?userName=${userName}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AuthForgotPassword = async ({ email = "" }: { email: string }) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/auth/forgot-password`,
      {
        email,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const VerifyOneTimePassword = async ({
  otp = "",
  userId = "",
}: {
  otp: string;
  userId: string;
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/auth/verify-otp`,
      {
        otp,
        userId,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChangePassword = async ({
  userId = "",
  newPassword = "",
  confirmPassword = "",
}: {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/auth/change-password`,
      {
        userId,
        newPassword,
        confirmPassword,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
