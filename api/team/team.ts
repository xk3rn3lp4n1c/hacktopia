"use server";

import { APP_API_ENDPOINT_URL } from "../api_endpoint";
import axios from "axios";
import { getToken } from "../token";

export const CreateTeam = async ({
  teamName = "",
  teamCode = "",
  teamCaptain = "",
}: {
  teamName: string;
  teamCode: string;
  teamCaptain: string;
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/auth/login`,
      {
        teamName,
        teamCode,
        teamCaptain,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
