import { Col, Form, Input, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import { SignInUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { setReloadUser } from "../../redux/features/userSlice";
import Loader from "../../components/Loader";

const SignIn = () => {
  const { reload } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    dispatch(setReloadUser(true));
    try {
      const response = await SignInUser(values);
      localStorage.setItem("token", response.token);
      if (response.success) {
        message.success(response.msg);
        window.location.href = "/";
        dispatch(setReloadUser(false));
      }
      message.error(response.error);
      dispatch(setReloadUser(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setReloadUser(false));
    }
  };

  if (reload) {
    return <Loader />;
  }

  return (
    <div className="bg-primary flex items-center justify-center h-screen">
      <div className="card w-400 p-2">
        <div className="flex items-center justify-between m-3">
          <h1 className="text-2xl">WALLET - SIGNUP</h1>
        </div>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Password" name="password">
                <Input type="password" />
              </Form.Item>
            </Col>
          </Row>

          <button className="primary-contained-btn w-100" type="submit">
            Sign In
          </button>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              className="text-sn underline mt-2"
              onClick={() => navigate("/signup")}
            >
              Not yet a member? Sign Up
            </div>
            <div
              className="text-sn underline mt-2"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
