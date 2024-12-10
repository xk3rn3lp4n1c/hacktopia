"use server";

import { APP_API_ENDPOINT_URL } from "../api_endpoint";
import axios from "axios";

export const CreateTeam = async ({
  teamName = "",
  teamMotto = "",
  teamCountry = "",
  teamCaptain = "",
  token = "", // Add token as a parameter
}: {
  teamName: string;
  teamMotto: string;
  teamCountry: string;
  teamCaptain: string;
  token: string; // Add token to the type definition
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/team/create`,
      {
        teamName,
        teamMotto,
        teamCountry,
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

export const JoinTeam = async ({
  teamId = "",
  userId = "",
  token = "", // Add token as a parameter
}: {
  teamId: string;
  userId: string;
  token: string; // Add token to the type definition
}) => {
  try {
    const response = await axios.post(
      `${APP_API_ENDPOINT_URL}/api/v1/team/join`,
      {
        teamId,
        userId,
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

export const ListTeams = async ({ token = "" }: { token: string }) => {
  try {
    const response = await axios.get(
      `${APP_API_ENDPOINT_URL}/api/v1/team/list`,
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

export const GetTeamDetails = async ({
  teamId = "",
  token = "",
}: {
  teamId: string;
  token: string;
}) => {
  try {
    const response = await axios.get(
      `${APP_API_ENDPOINT_URL}/api/v1/team/teamDetails/?teamId=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetTeamDetails:", error); // Debugging
    throw error;
  }
};

export const GetMyTeamDetails = async ({
  userId = "",
  token = "",
}: {
  userId: string;
  token: string;
}) => {
  try {
    const response = await axios.get(
      `${APP_API_ENDPOINT_URL}/api/v1/team/myTeam/?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetTeamDetails:", error); // Debugging
    throw error;
  }
};