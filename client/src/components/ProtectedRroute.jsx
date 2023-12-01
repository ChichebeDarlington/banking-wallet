import { useEffect } from "react";
import { userInfo } from "../apicalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setReloadUser,
  userRequest,
} from "../redux/features/userSlice";

const ProtectedRroute = ({ children }) => {
  const navigate = useNavigate();

  const { user, reload } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(setReloadUser(true));
    try {
      const response = await userInfo();
      if (response.success) {
        dispatch(setReloadUser(false));
        dispatch(setUser(response.user));
      } else {
        message.error(response.error);
        console.log(response.error);
        navigate("/signin");
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      message.error(error.error);
      dispatch(setReloadUser(false));
    }
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      if (!user) {
        getData();
        dispatch(userRequest());
      }
    } else {
      navigate("/signin");
    }
  }, []);

  useEffect(() => {
    if (reload) {
      getData();
    }
  }, [reload]);

  return token && children;
};

export default ProtectedRroute;
