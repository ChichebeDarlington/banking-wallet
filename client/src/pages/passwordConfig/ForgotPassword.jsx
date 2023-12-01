import { Col, Form, Input, Row, message } from "antd";
import { forgotPassword } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setReloadUser } from "../../redux/features/userSlice";
import Loader from "../../components/Loader";

const ForgotPassword = () => {
  const { reload } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (value) => {
    dispatch(setReloadUser(true));
    try {
      const response = await forgotPassword(value);
      if (response.success) {
        navigate("/signin");
        dispatch(setReloadUser(false));
        message.success(response.msg);
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
          <h1 className="text-lg text-center">WALLET - FORGOT PASSWORD</h1>
        </div>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <button className="primary-contained-btn w-100" type="submit">
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
