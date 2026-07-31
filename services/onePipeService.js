import axios from "axios";

const BASE_URL = process.env.ONEPIPE_BASE_URL;

export const onePipe = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.ONEPIPE_API_KEY}`,
    "Content-Type": "application/json",
  },
});
