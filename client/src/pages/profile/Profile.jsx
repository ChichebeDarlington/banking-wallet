import { Col, Form, Input, Row, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setReloadUser } from "../../redux/features/userSlice";
import { updateUserProfile, userInfo } from "../../apicalls/users";
import Loader from "../../components/Loader";

const Profile = () => {
  const { reload } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const details = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    identityNumber: "",
    identityType: "",
    isVerified: "",
    address: "",
  };
  const [profile, setProfile] = useState(details);

  const dispatch = useDispatch();

  const getUser = async () => {
    dispatch(setReloadUser(true));
    try {
      const response = await userInfo();
      if (response?.success) {
        setProfile(response?.user);
        dispatch(setReloadUser(false));
      } else {
        message.error(response.error);
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      console.log(error);
      message.error(error.error);
      dispatch(setReloadUser(false));
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  async function onChange(e) {
    setProfile((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  async function onSubmit() {
    dispatch(setReloadUser(true));
    try {
      const response = await updateUserProfile({ ...profile });
      if (response.success) {
        message.success(response.msg);
        getUser();
        dispatch(setReloadUser(false));
      }
    } catch (error) {
      console.log(error.error);
      message.error(error.error);
      dispatch(setReloadUser(false));
    }
  }

  if (reload) {
    return <Loader />;
  }

  return (
    <div className="m-5">
      <div className="flex items-center justify-between m-3">
        <h1 className="text-2xl">MY - PROFILE</h1>
      </div>
      <hr />
      <Form
        layout="vertical"
        onFinish={onSubmit}
        style={{
          position: "relative",
        }}
      >
        <Row gutter={16} className="">
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="First Name">
              <Input
                value={profile?.firstName}
                onChange={onChange}
                name="firstName"
              />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Last Name">
              <Input
                value={profile?.lastName}
                onChange={onChange}
                name="lastName"
              />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Email">
              <Input value={profile?.email} onChange={onChange} name="email" />
            </Form.Item>
          </Col>
          <Col span={6} xs={24} sm={12} md={8}>
            <Form.Item label="Mobile">
              <Input
                value={profile?.mobile}
                onChange={onChange}
                name="mobile"
              />
            </Form.Item>
          </Col>

          <Col span={8} xs={24} sm={12} md={8}>
            <Form.Item label="ID type">
              <Select
                value={profile?.identityType}
                name="identityType"
                onChange={onChange}
                disabled
              >
                <Select.Option value={profile?.identityType}>
                  {profile?.identityType}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} xs={24} sm={12} md={8}>
            <Form.Item label="ID number">
              <Input
                value={profile?.identityNumber}
                name="identityNumber"
                onChange={onChange}
                disabled
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Address">
              <Input.TextArea
                value={profile?.address}
                name="address"
                onChange={onChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end">
          <button
            className="primary-contained-btn"
            type="submit"
            // style={{ position: "absolute", bottom: 5 }}
          >
            Update Profile
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Profile;
