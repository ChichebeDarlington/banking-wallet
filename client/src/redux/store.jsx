import { configureStore } from "@reduxjs/toolkit";
// The cart reducer(function) that controls the state in our slice
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
