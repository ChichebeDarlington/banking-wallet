import { Col, Form, Input, Row, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { SignUpUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { setReloadUser } from "../../redux/features/userSlice";
import Loader from "../../components/Loader";

const SignUp = () => {
  const { reload } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    dispatch(setReloadUser(true));
    if (values.password !== values.confirmPassword) {
      dispatch(setReloadUser(false));
      message.error("Password not matched");
      return;
    }
    try {
      const response = await SignUpUser(values);
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

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Custom logic or additional checks before submitting the form
    // You can also call onFinish() here if needed
  };

  if (reload) {
    return <Loader />;
  }

  return (
    <div className="m-5">
      <div className="flex items-center justify-between m-3">
        <h1 className="text-2xl">WALLET - SIGNUP</h1>
        <div className="text-sn underline" onClick={() => navigate("/signin")}>
          Already a member? Signin
        </div>
      </div>
      <hr />
      <Form layout="vertical" onSubmit={handleFormSubmit} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="First Name" name="firstName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Last Name" name="lastName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Mobile" name="mobile">
              <Input />
            </Form.Item>
          </Col>

          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="ID type" name="identityType">
              <Select>
                <Select.Option value="nationalId">National ID</Select.Option>
                <Select.Option value="votersCard">Voters Card</Select.Option>
                <Select.Option value="drivingLicense">
                  Driving Lincense
                </Select.Option>
                <Select.Option value="internationPassport">
                  International Passport
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="ID number" name="identityNumber">
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Address" name="address">
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Password" name="password">
              <Input type="password" />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Confirm" name="confirmPassword">
              <Input type="password" />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end">
          <button className="primary-contained-btn" type="submit">
            Sign up
          </button>
        </div>
      </Form>
    </div>
  );
};

export default SignUp;
