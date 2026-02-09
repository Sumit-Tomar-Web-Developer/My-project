import axios from "axios";
import { TOOL_FRONTEND_URL, TOOL_API_URL } from "./APIUrls";
import {
  clearUserDataFromLocal,
  getTokenFromLocal,
} from "../Utils/LocalStorageUtil";

const customAxios = (contentType) => {
  const axiosClient = axios.create(
    {
      baseURL: TOOL_API_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": contentType,
      },
    }
  );

  axiosClient.interceptors.request.use(
    function (config) {
      const token = getTokenFromLocal();
      if (token !== null) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    }
  );

  axiosClient.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.code === "ERR_NETWORK") {
        console.log("Request timed out");
      }
      let res = error.response;
      if (res) {
        switch (res.status) {
          case 401: //unauthorized
            clearUserDataFromLocal();
            window.location.pathname = TOOL_FRONTEND_URL + "signin";
            break;
          case 403: // Forbidden
            window.location.pathname = TOOL_FRONTEND_URL + "access_denied";
            break;
          default:
            console.log(res);
            break;
        }
      }

      return Promise.reject(error.response);
    }
  );

  return axiosClient;
};

export default customAxios;
