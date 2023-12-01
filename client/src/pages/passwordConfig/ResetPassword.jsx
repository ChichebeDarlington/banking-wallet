import { Col, Form, Input, Row, message } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { setReloadUser } from "../../redux/features/userSlice";
import Loader from "../../components/Loader";

const ResetPassword = () => {
  const { reload } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { _id, token } = useParams();
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get("token");

  console.log(_id);
  console.log(token);

  const onFinish = async (values) => {
    console.log(values);
    dispatch(setReloadUser(true));
    try {
      const response = await resetPassword(
        {
          password: values.password,
        },
        _id,
        token
      );
      if (response.success) {
        message.success(response.msg);
        navigate("/signin");
        dispatch(setReloadUser(false));
      }
      message.error(response.error);
      dispatch(setReloadUser(false));
    } catch (error) {
      message.error(error.error);
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
          <h1 className="text-lg text-center">WALLET - RESET PASSWORD</h1>
        </div>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Password" name="password">
                <Input type="password" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Confirm password" name="confirmPassword">
                <Input type="password" />
              </Form.Item>
            </Col>
          </Row>

          <button className="primary-contained-btn w-100" type="submit">
            Submit
          </button>
          <div
            className="text-sn underline mt-2"
            onClick={() => navigate("/signup")}
          >
            Not yet a member? Sign Up
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
