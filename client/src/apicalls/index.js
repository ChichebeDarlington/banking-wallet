import axios from "axios";

const token = localStorage.getItem("token");
// console.log(token);

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
