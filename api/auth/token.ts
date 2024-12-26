"use server";

import { APP_API_ENDPOINT_URL } from "../api_endpoint";
import axios from "axios";

export const ValidateRequest = async ({ token = "" }: { token: string }) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/token/validate`,
      {
        token,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    return;
  } catch (error) {
    throw error;
  }
};
