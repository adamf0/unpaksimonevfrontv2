import axios from "axios";

const apiCall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiCall.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;
      (config as any).__abortController = controller;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//signal: controller.signal,
export default apiCall;
