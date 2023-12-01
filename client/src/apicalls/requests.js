import { axiosInstance } from "./index";

export const fetchRequests = async () => {
  try {
    const { data } = await axiosInstance.get(`/request/fetch-request`);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const sendRequests = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/request/send-request`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateRequestStatus = async (payload) => {
  try {
    const { data } = await axiosInstance.patch(
      `/request/request-status`,
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
