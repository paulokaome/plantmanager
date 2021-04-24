import axios from "axios";

const ip = "http://192.168.1.73:3333";

const api = axios.create({
  baseURL: ip,
});

export default api;
