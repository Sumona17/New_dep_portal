import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { LoginRoute } from "constants/routes";

const instance = axios.create({
  baseURL: process.env.REACT_APP_GW_BASE_URL
});

export const customIstance = axios.create({});

const interceptorHandling = (axiosInstance, navigate, toast) => {
  const resInterceptor = (response) => {
    return response;
  };

  const errInterceptor = async (error) => {
    if (error?.response?.status == 401) {
      localStorage.clear();
      navigate(LoginRoute.path);
      toast.error(error?.response?.data?.error || error?.message);
      return Promise.reject(error);
    }
    if (typeof error?.response?.data?.error == "object") {
      for (let key in error?.response?.data?.error) {
        toast.error(error?.response?.data?.error[key]);
      }
      return Promise.reject(error);
    } else {
      toast.error(error?.response?.data?.error || error?.message);
      return Promise.reject(error);
    }
  };

  const interceptor = axiosInstance.interceptors.response.use(
    resInterceptor,
    errInterceptor
  );

  return () => axiosInstance.interceptors.response.eject(interceptor);
};
export const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => interceptorHandling(instance, navigate, toast), []);
  useEffect(() => interceptorHandling(customIstance, navigate, toast), []);

  return children;
};

export default instance;
