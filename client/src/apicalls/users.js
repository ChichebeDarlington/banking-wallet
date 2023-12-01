import { axiosInstance } from ".";

export const SignUpUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/user/signup`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};
export const verifyEmail = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/user/verify-email`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const SignInUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/user/signin`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const forgotPassword = async (payload) => {
  try {
    const { data } = await axiosInstance.post(`/user/forgot-password`, payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const resetPassword = async (payload, _id, token) => {
  try {
    const { data } = await axiosInstance.patch(
      `/user/reset-password/${_id}/${token}`,
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const userInfo = async () => {
  try {
    const { data } = await axiosInstance.get(`/user/user-info`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllUser = async () => {
  try {
    const { data } = await axiosInstance.get(`/user/get-users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const verifyUser = async (payload) => {
  try {
    const { data } = await axiosInstance.patch(`/user/verify-users`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateUserProfile = async (payload) => {
  try {
    const { data } = await axiosInstance.patch(
      `/user/update-user-profile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
