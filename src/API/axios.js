import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://amazon-api-deploy-qew7.onrender.com",  

  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { axiosInstance };