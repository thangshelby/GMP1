import axios, { AxiosInstance } from "axios";

const baseURL = "http://192.168.1.7:5000";
// const baseURL = "http://localhost:5000";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

const http = new Http().instance;

export default http;
