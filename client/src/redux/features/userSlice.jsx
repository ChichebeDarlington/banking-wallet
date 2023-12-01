import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../apicalls";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  reload: false,
};

export const userRequest = createAsyncThunk("user/userRequest", async () => {
  try {
    const response = await axiosInstance.get(`/user/user-info`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async (emailToken) => {
    try {
      const response = await axiosInstance.post("/user/verify-email", {
        emailToken,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setReloadUser: (state, action) => {
      state.reload = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRequest.pending, (state) => {
        state.reload = true;
      })
      .addCase(userRequest.fulfilled, (state, action) => {
        state.user = action.payload;
        state.reload = false;
      })
      .addCase(userRequest.rejected, (state) => {
        state.reload = false;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.reload = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        console.log(action.payload);
        state.user = action.payload;
        state.reload = false;
        // localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(verifyEmail.rejected, (state) => {
        state.reload = false;
      });
  },
});

export const { setUser, setReloadUser } = userSlice.actions;

export default userSlice.reducer;
