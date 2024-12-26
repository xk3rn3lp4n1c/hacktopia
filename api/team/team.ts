"use server";

import { APP_API_ENDPOINT_URL } from "../api_endpoint";
import axios from "axios";

export const CreateTeam = async ({
  teamName = "",
  teamCode = "",
  teamCaptain = "",
  token = "", // Add token as a parameter
}: {
  teamName: string;
  teamCode: string;
  teamCaptain: string;
  token: string; // Add token to the type definition
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/team/create`,
      {
        teamName,
        teamCode,
        teamCaptain,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use the passed token
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChkTeam = async ({
  teamName = "",
  token = "",
}: {
  teamName: string;
  token: string;
}) => {
  try {
    const response = await axios.get(
      `${APP_API_ENDPOINT_URL}/api/v1/team/chk-team?teamName=${teamName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
