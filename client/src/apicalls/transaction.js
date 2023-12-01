import { axiosInstance } from "./index";

export const verifyUserAccount = async (payload) => {
  try {
    const { data } = await axiosInstance.post(
      `/transact/verify-account`,
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const transferFunds = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/transact/transfer`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllTransact = async (payload) => {
  try {
    const { data } = await axiosInstance.get(
      `/transact/fetch-transacts`,
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const depositTransact = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/transact/deposit`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};
