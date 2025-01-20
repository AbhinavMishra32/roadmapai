import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL as string;
if (!baseURL) {
    throw new Error('API_URL is not set in environment variables');
}

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});