import axios from "axios";

const serverLocation = import.meta.env.VITE_SERVER_LOCATION;

if (!serverLocation) {
  throw new Error("Server location (VITE_SERVER_LOCATION) is not defined");
}

export const api = axios.create({
  baseURL: `${serverLocation}/api`,
});
