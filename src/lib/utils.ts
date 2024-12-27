import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { io } from "socket.io-client";
import { APP_API_ENDPOINT_URL } from "../../api/api_endpoint";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const socketServer = io(APP_API_ENDPOINT_URL);