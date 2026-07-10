import axios from "axios";

const GOOGLE_API_TIMEOUT_MS = 15_000;

export const googlePlacesClient = axios.create({
  baseURL: "https://places.googleapis.com/v1",
  timeout: GOOGLE_API_TIMEOUT_MS,
});

export const googleRoutesClient = axios.create({
  baseURL: "https://routes.googleapis.com",
  timeout: GOOGLE_API_TIMEOUT_MS,
});
